var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

socket.on('lost', function(data) {
    console.log("BAHAHAHA")
})

socket.on('players', function(data) {
    console.log(data);
})

socket.emit('new player');

function sendUsername(){

    var button = document.getElementById("username");
    socket.emit('username', button.value);
}

function sendReady(){
    socket.emit('start game');
}