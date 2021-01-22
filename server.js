//LAUNCH:
//node server.js 





// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
//Connect the CSS folder to this server.
app.use(express.static(path.join(__dirname, 'css')));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
  });

  // Starts the server.
server.listen(5000, function() {
    console.log('Starting server on port 5000');
  });

  // Add the WebSocket handlers
// io.on('connection', function(socket) {
// });

// setInterval(function() {
//     let value = Math.random();
//     if (value <= 0.1)
//         io.sockets.emit('lost','...');
//     else
//         io.sockets.emit('message', 'hi!' + value);
//   }, 1000);

  var players = {};
  var playerCards = {};
  let connectedPlayers = 0;
  var currentLevel = 1;
  var playedCards = [];
  var drawnCards = [];
var lastIndex = 0;
var gameBusy = false;

io.on('connection', function(socket) {

    //Handle the disconnection of a player:
    //See reasons: https://socket.io/docs/v3/server-socket-instance/
    socket.on("disconnect", (reason) => {
        players[socket.id] = {
          username: "",
          ready: false
      };

        io.sockets.emit("message", `Player: ${players[socket.id].username} disconnected. \n players: ${connectedPlayers}`);
        countPlayers();
        //connectedPlayers--;
        //io.sockets.emit("message", "players: " + connectedPlayers);
      });

    socket.on('new player', function() {
        //Check if game is already happening and let player wait if so
        players[socket.id] = {
            username: "",
            ready: false
        };

        countPlayers();

        //connectedPlayers = //Object.filter(players, x => x.username != "").length;
        io.sockets.emit("message", "New player joined. players: " + connectedPlayers);
    });

    //New username set
    socket.on('username', (username) => {
        socket.username = username;
        players[socket.id].username = username;
        players[socket.id].ready = false;
        io.sockets.emit('players',players)
        
        //connectedPlayers++;
        countPlayers();

        io.sockets.emit("message", `Player: ${username} connected. players: ${connectedPlayers}`);
    });

    socket.on('start game', () => {
        players[socket.id].ready = true;

        var playersNotReady = 0;
        var totalPlayers =0

        //We can't start if a game is already in progress:
        if (gameBusy)
        {
          io.to(socket.id).emit("message", "Game already in progress");
          return;
        }

        //Object.filter(players,x => !x.ready).length;
        for (player in players){
          if (players[player].username != ""){
            totalPlayers++;

            if (!players[player].ready)
              playersNotReady++;
          }
        }

        // if (totalPlayers <= 1){
        //   io.sockets.emit("message", `You can't play the game on your own. Wait for others to connect`);
        //   return;
        // }

        if (playersNotReady != 0 ){
          io.sockets.emit("message", playersNotReady + " not ready");
          return;
        }

        io.sockets.emit("message", "Everyone ready!");
        initGame();

        //Let everyone know we are starting!
        io.sockets.emit("game started","Let's go!");

        sendCardsToPlayers();

        
        
    })

    socket.on('card played', (card) => {

      //Check if this player has this card in his deck:
      if (playerCards[socket.id].indexOf(card) == -1)
        return;

        //Add to played cards
        playedCards.push(card);

        //Remove from this players deck.
        playerCards[socket.id].splice(playerCards[socket.id].indexOf(card), 1);

        //Wanna be fancy? You can combine the above 2 lines by:
        //playedCards.push(
          //playerCards[socket.id].splice(playerCards[socket.id].indexOf(card), 1)
        //)

        var lost = false;
        //We should check if the game is lost..
        if (card != drawnCards[lastIndex]){
          console.log(`They lost!`);
          console.log(`played card: ${card}, lastIndex: ${lastIndex}, card of index: ${drawnCards[lastIndex]}`);
        
          lost = true;

          endRound();
          roundLost();
        }

        lastIndex++;

        //Show the played card to the players
        io.sockets.emit("card played", {card: card, lost:lost});
        console.log(`card played: ${card} by ${players[socket.id].username}. \n ${playedCards.length} of ${drawnCards.length} played.`);

        //Send the decks back to the players, just in case.
        sendCardsToPlayers();

        //And also if this round is won..
        if (playedCards.length == drawnCards.length)
        {
          //Let everyone know the round is over
          io.sockets.emit("round over","Let's go next!");
          console.log("round over");

          endRound();

          //Increase level.
          currentLevel++;
        
        }
    })


    

});

var countPlayers = function(countReady){
  connectedPlayers = 0;

  var countOnlyReady = countReady ?? false;
  //console.log(players);

  for (var player in players){

    if (players[player].username != ""){
      //console.log(player.username);
      connectedPlayers++;
   }

  }

}

var initGame = function() {

  var amtPlayers = 0//countPlayers(true);
  //var drawnCards = [];

  //Prepare empty decks for players:
  playerCards = {};
  drawnCards = [];
  lastIndex = 0;
  playedCards = [];

  for (player in players) {
    var tObj = players[player];
    
    //Skip if not ready
    if (!tObj.ready)
      continue;
    
    //If this player is ready to play, prepare his deck.
    playerCards[player] = [];
    //Count players
    amtPlayers++;
  }

  //Send out the cards:
  //For each level: 1 card per player
  for (var levelIndex = 0; levelIndex < currentLevel; levelIndex++){

    //Loop over the player decks
    for (player in playerCards){
      tObj = playerCards[player];
      
      //Draw random card between 1 and 100 (inclusive)
      var drawnCard = 0;
      do{
        drawnCard = Math.floor((Math.random() * 100)+1);
      } while(drawnCards.indexOf(drawnCard) != -1)

      drawnCards.push(drawnCard);
      //console.log(`Drawn cards upto now:`);
      //console.log(drawnCards);
      tObj.push(drawnCard);
    }
    
  }

  console.log("=-=-=-=-=-=-=-=-")
  console.log("Handed out all cards");
  console.log("=-=-=-=-=-=-=-=-")

  //Loop over the players and sort their cards:
  for (player in playerCards){
    playerCards[player] =  playerCards[player].sort((a,b) => a - b);
  }

  //Sort the drawncards:
  drawnCards = drawnCards.sort((a,b) => a - b);

  console.log(playerCards);

  gameBusy = true;
}

var endRound = function() {

  playerCards = {};
  gameBusy = false;

  //Nobody is ready anymore..
  for (player in players) {
    players[player].ready = false;
  }
}

var sendCardsToPlayers = function(){

  //Get number of cards for each user:
  // var cardsPerUser = {}
  // for (player in playerCards) {

  //   cardsPerUser[player] = playerCards[player].length;
  // }

  for (player in playerCards){

    var data = {}
    data["own"] =  playerCards[player];

    // var tempRandom = Math.floor((Math.random() * 6) + 1);
     data["others"] = [];
    // for (var i = 0; i < tempRandom; i++){

    //   data["others"].push(Math.floor((Math.random() * 7) + 1));
    // }
    //data["others"] = [3,2,4];

    for (subplayer in playerCards){

      if (subplayer == player)
        continue;

      data["others"].push(playerCards[subplayer].length);
    }


    io.to(player).emit("cards", data);

    //console.log(`sending to player: ${player}, cards:`)
    //console.log(playerCards[player]);

  }
}

var roundLost = function(){

  io.sockets.emit("round lost",`Round lost, next card was: ${drawnCards[lastIndex]}`);

  currentLevel = 1;
}