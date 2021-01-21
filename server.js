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
  var playercards = {};
io.on('connection', function(socket) {

    //Handle the disconnection of a player:
    //See reasons: https://socket.io/docs/v3/server-socket-instance/
    socket.on("disconnect", (reason) => {
        players[socket.id] = {}
        io.sockets.emit("message", "Player: " + socket.id + " disconnected.");
    });

    socket.on('new player', function() {
        //Check if game is already happening and let player wait if so
        players[socket.id] = {
            username: "",
            ready: false
        };
    });

    //New username set
    socket.on('username', (username) => {
        socket.username = username;
        players[socket.id].username = username;
        players[socket.id].ready = false;
        io.sockets.emit('players',players)

    });

    socket.on('start game', () => {
        players[socket.id].ready = true

        if (players.filter)
        ;
    })
  //});

//io.on('')

});



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