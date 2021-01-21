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
  var currentLevel = 8;
io.on('connection', function(socket) {

    //Handle the disconnection of a player:
    //See reasons: https://socket.io/docs/v3/server-socket-instance/
    socket.on("disconnect", (reason) => {
        players[socket.id] = {
          username: "",
          ready: false
      };

        io.sockets.emit("message", "Player: " + socket.id + " disconnected.");
        countPlayers();
        //connectedPlayers--;
        io.sockets.emit("message", "players: " + connectedPlayers);
      });

    socket.on('new player', function() {
        //Check if game is already happening and let player wait if so
        players[socket.id] = {
            username: "",
            ready: false
        };

        countPlayers();

        //connectedPlayers = //Object.filter(players, x => x.username != "").length;
        io.sockets.emit("message", "players: " + connectedPlayers);
    });

    //New username set
    socket.on('username', (username) => {
        socket.username = username;
        players[socket.id].username = username;
        players[socket.id].ready = false;
        io.sockets.emit('players',players)
        
        //connectedPlayers++;
        countPlayers();

        io.sockets.emit("message", "players: " + connectedPlayers);
    });

    socket.on('start game', () => {
        players[socket.id].ready = true;

        var playersNotReady = 0;
        //Object.filter(players,x => !x.ready).length;
        for (player in players){
          if (players[player].username != "" && !players[player].ready)
            playersNotReady++;
        }

        if (playersNotReady == 0){
          io.sockets.emit("message", "Everyone ready!");
          initGame();

        }
        else
          io.sockets.emit("message", playersNotReady + " not ready");
    })
  //});

//io.on('')

    

});

var countPlayers = function(countReady){
  connectedPlayers = 0;

  var countOnlyReady = countReady || false;
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
  var drawnCards = [];

  //Prepare empty decks for players:
  playerCards = {};

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
        var drawnCard = Math.floor((Math.random() * 100)+1);
      } while(drawnCards.indexOf(drawnCards) != -1)

      drawnCards.push(drawnCard);
      tObj.push(drawnCard);
    }
    
  }

  console.log(playerCards);
}

// socket.on('movement', function(data) {
//     var player = players[socket.id] || {};
//     if (data.left) {
//       player.x -= 5;
//     }
//     if (data.up) {
//       player.y -= 5;
//     }
//     if (data.right) {
//       player.x += 5;
//     }
//     if (data.down) {
//       player.y += 5;
//     }
//   });
// });

// setInterval(function() {
//     io.sockets.emit('state', players);
//   }, 1000 / 60);