var cardColors = [
    "#FF9797",
    "#97C8FF",
    "#97FFA9",
    "#FFFF97",
    "#FC836A",
    "#FCBD6A",
    "#E397FF",
]

var socket = io();
socket.on('message', function (data) {
    console.log(data);
    document.getElementById("message").innerText = data;
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
            class="playcard ${(first)? "" : "cardDisabled"}" 
            ${(first) ? 'onClick="sendCard('+ownCards[card]+')"':""}><p>${ownCards[card]}</p></div>`;

        first = false;
    }

    document.getElementById("cards").innerHTML = /*htmlString +*/ newHtmlString;

    //Draw other cards.
    drawOtherCardsOnCanvas(otherCards);
    
});

socket.on('game started', function () {
    document.getElementById("btnReady").hidden = true;
    cleanCanvas();
});

socket.on('round over', function () {
    document.getElementById("btnReady").hidden = false;
})
socket.on('round lost', function (data) {
    document.getElementById("message").innerText = data;
    document.getElementById("btnReady").hidden = false;
    document.getElementById("cards").innerHTML = "";
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
}

function sendReady() {
    socket.emit('start game');
}

function sendCard(cardNumber) {

    socket.emit('card played', cardNumber);
}

