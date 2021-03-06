var cardColors = [
    "#FF9797",
    "#97C8FF",
    "#97FFA9",
    "#FFFF97",
    "#FC836A",
    "#FCBD6A",
    "#E397FF",
]

const cGAMESTATES = {
    "LOBBY": 1,
    "STARTING": 2,
    "INGAME": 3,
    "LOST": 4,
    "WON": 5,
    "WAITING_FOR_READY": 6, //You didn't click ready yet.
    "WAITING_READY": 7 //You are ready, others are not..
}

var restartTimeout;
var gameState = 0;

var socket = io();
socket.on('message', function (data) {
    console.log(data);
    //document.getElementById("message").innerText = data;
    WriteTextMessage(data);
});

socket.on('warning', function (data) {
    //console.log(data);
    //document.getElementById("message").innerText = data;
    WriteTextMessage(data, "warning");
});

socket.on('error', function (data) {
    //console.log(data);
    //document.getElementById("message").innerText = data;
    WriteTextMessage(data, "error");
});

socket.on('cards', function (data) {

    //Own cards first:
    //var htmlString = "";
    var newHtmlString = "";
    var first = true;
    var ownCards = data.own;
    var otherCards = data.others;
    for (card in ownCards) {

        /*htmlString += `<button class="card" 
            value='${data[card]}'
            onClick='sendCard(${data[card]})'
            ${(first) ? "" : "disabled='disabled'"}>
                ${data[card]}</button>`;*/

        newHtmlString += `<div 
            class="playcard ${(first) ? "" : "cardDisabled"} ${(gameState == cGAMESTATES.STARTING) ? "startingGame" : ""}" 
            ${(first) ? 'onClick="sendCard(' + ownCards[card] + ')"' : ""}><p>${ownCards[card]}</p></div>`;

        first = false;
    }

    document.getElementById("cards").innerHTML = /*htmlString +*/ newHtmlString;

    //Draw other cards.
    drawOtherCardsOnCanvas(otherCards);

});

socket.on('game started', function () {

    cleanCanvas();
    changeGameState(cGAMESTATES.STARTING);
    //gameState = cGAMESTATES.STARTING;
    //readyAnimation();
});

socket.on("waiting on others", function () {
    changeGameState(cGAMESTATES.WAITING_READY);
})

socket.on('round won', function () {
    changeGameState(cGAMESTATES.WON);
    WriteTextMessage("Time for next round!", "warning");

    //document.getElementById("btnReady").hidden = false;
})
socket.on('round lost', function (data) {
    WriteTextMessage(data, "warning");
    changeGameState(cGAMESTATES.LOST);
});

socket.on('players', function (data) {
    console.log(data);

    var htmlText = "";

    for (player in data) {

        if (data[player].username == "")
            continue;

        htmlText += `<li ${!data[player].ready ? 'class="notReady"' : ""}>${data[player].username}</li>`;
    }
    document.getElementById("players").innerHTML = htmlText;
});


socket.on("card played", function (data) {

    //It would be nice if we could draw on a canvas here and simulate cards on 
    //top of each other with a slight rotation.. But for now..

    //document.getElementById("lastCard").innerText = data.card;
    drawCardOnCanvas(data.card, data.lost);




});

socket.emit('new player');

function sendUsername() {

    var button = document.getElementById("username");
    socket.emit('username', button.value);
    changeGameState(cGAMESTATES.WAITING_FOR_READY);
}

function sendReady() {
    socket.emit('start game');

}

function sendCard(cardNumber) {

    if (gameState == cGAMESTATES.STARTING)
        return;

    socket.emit('card played', cardNumber);
}

function changeGameState(newState) {

    gameState = newState;

    switch (gameState) {
        case cGAMESTATES.LOBBY:
            break;
        case cGAMESTATES.STARTING:
            readyAnimation();
            //document.getElementById("btnReady").hidden = true;
            break;
        case cGAMESTATES.INGAME:
            cleanCenter();
            var coll = document.getElementsByClassName("startingGame");

            while (coll[0]) {
                coll[0].classList.remove('startingGame')
            }


            break;
        case cGAMESTATES.LOST:
            // document.getElementById("btnReady").hidden = true;
            // document.getElementById("btnReady").hidden = false;
            //document.getElementById("cards").innerHTML = "";
            var coll = document.getElementsByClassName("playcard");

            for (var i = 0; i < coll.length; i++) { //(coll[0]) {
                coll[i].classList.add('startingGame');
            }

            restartTimeout = setTimeout(() => {
                changeGameState(cGAMESTATES.WAITING_FOR_READY);
            }, 5000);

            break;

        case cGAMESTATES.WON:
            restartTimeout = setTimeout(() => {
                changeGameState(cGAMESTATES.WAITING_FOR_READY);
            }, 5000);

            
            //document.getElementById("btnReady").hidden = false;
            break;
        case cGAMESTATES.WAITING_FOR_READY:
            document.getElementById("cards").innerHTML = "";

            drawReadyButton();
            break;

        case cGAMESTATES.WAITING_READY:
            drawWaiting();
            break;
    }
}