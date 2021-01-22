var socket = io();
socket.on('message', function(data) {
  console.log(data);
  document.getElementById("message").innerText = data;
});

socket.on('cards', function(data){

    var htmlString = "";
    var first = true;
    for (card in data){
        
        htmlString += `<button class="card" 
            value='${data[card]}'
            onClick='sendCard(${data[card]})'
            ${(first) ? "" : "disabled='disabled'"}>
                ${data[card]}</button>`;

        first = false;
    }

    document.getElementById("cards").innerHTML = htmlString;

});

socket.on('lost', function(data) {
    console.log("BAHAHAHA")
});

socket.on('players', function(data) {
    console.log(data);
});

socket.on("card played", function(data) {

    //It would be nice if we could draw on a canvas here and simulate cards on 
    //top of each other with a slight rotation.. But for now..

    document.getElementById("lastCard").innerText = data;
});

socket.emit('new player');

function sendUsername(){

    var button = document.getElementById("username");
    socket.emit('username', button.value);
}

function sendReady(){
    socket.emit('start game');
}

function sendCard(cardNumber){

    socket.emit('card played', cardNumber);
}