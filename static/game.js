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

        htmlText += `<li>${data[player].username}</li>`;
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

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

function cleanCanvas(){

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawOtherCardsOnCanvas(otherCards){

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    //Let's clear the sides first:
    context.clearRect(0, 0, canvas.width, 100);
    context.clearRect(0, 0, 100, canvas.height);
    context.clearRect(canvas.width-100, 0, 100, canvas.height);
    context.clearRect(0, canvas.height - 100, canvas.width, 100);

    var nmbOtherPlayers = otherCards.length;

    //Let's start with the left side..
    switch (nmbOtherPlayers) {
        case 1:
            drawCardRegion(50, 0, canvas.width - 100, 100, otherCards[0], cardColors[0]);
            break;
        case 2:
            drawCardRegion(0, 50, 100, canvas.height - 100, otherCards[0], cardColors[0]);
            drawCardRegion(canvas.width - 20, 50, 100, canvas.height - 100, otherCards[1], cardColors[1]);
            break;
        case 3:
            drawCardRegion(0, 50, 100, canvas.height - 100, otherCards[0], cardColors[0]);
            drawCardRegion(canvas.width - 20, 50, 100, canvas.height - 100, otherCards[1], cardColors[1]);
            drawCardRegion(50, 0, canvas.width - 100, 100, otherCards[2], cardColors[2]);
            break;
        //TO DO - continue for 5, 6 and 7
        case 4:
            drawCardRegion(0, 50, 100, canvas.height - 100, otherCards[0], cardColors[0]);
            drawCardRegion(canvas.width - 20, 50, 100, canvas.height - 100, otherCards[1], cardColors[1]);
            drawCardRegion(50, 0, (canvas.width - 100) / 2, 100, otherCards[2], cardColors[2]);
            drawCardRegion(50 + ((canvas.width - 100)/2), 0, (canvas.width - 100) / 2, 100, otherCards[3], cardColors[3]);
            break;

        case 5:
            drawCardRegion(0, 50, 100, (canvas.height - 100)/2, otherCards[0], cardColors[0]);
            drawCardRegion(0, 50+((canvas.height-100)/2), 100, (canvas.height - 100)/2, otherCards[1], cardColors[1]);

            drawCardRegion(canvas.width - 20, 50, 100, (canvas.height - 100)/2, otherCards[2], cardColors[2]);
            drawCardRegion(canvas.width - 20, 50+((canvas.height-100)/2), 100, (canvas.height - 100)/2, otherCards[3], cardColors[3]);

            drawCardRegion(50, 0, canvas.width - 100, 100, otherCards[4], cardColors[4]);
            break;
        
        case 6:
            drawCardRegion(0, 50, 100, (canvas.height - 100)/2, otherCards[0], cardColors[0]);
            drawCardRegion(0, 50+((canvas.height-100)/2), 100, (canvas.height - 100)/2, otherCards[1], cardColors[1]);

            drawCardRegion(canvas.width - 20, 50, 100, (canvas.height - 100)/2, otherCards[2], cardColors[2]);
            drawCardRegion(canvas.width - 20, 50+((canvas.height-100)/2), 100, (canvas.height - 100)/2, otherCards[3], cardColors[3]);

            drawCardRegion(50, 0, (canvas.width - 100) / 2, 100, otherCards[4], cardColors[4]);
            drawCardRegion(50 + ((canvas.width - 100)/2), 0, (canvas.width - 100) / 2, 100, otherCards[5], cardColors[5]);
            break;
    }
}

function drawCardRegion(x,y,width, height, amount, color){

    var interspace = 10;
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var horizontal = (width > height);

    var usefulSize = (horizontal) ? width : height;

    //Let's try to calculate our card width.
    var cardWidth = (usefulSize - (interspace*amount) ) / amount;
    cardWidth = (cardWidth > 50) ? 50 : cardWidth;

    //Calculate our startpoint for drawing
    var usedWidth = (interspace*amount) + (cardWidth * amount);
    var startPoint = (usefulSize - usedWidth) / 2;

    startPoint += (horizontal) ? x: y;

    context.fillStyle = color;

    for (var i = 0; i < amount; i++){

        if (horizontal)
            context.fillRect(startPoint, y, cardWidth, 20);
        else
            context.fillRect(x, startPoint, 20, cardWidth);

        startPoint += cardWidth + interspace;

    }


}

function drawCardOnCanvas(cardnumber, lost) {

    //Check for lost
    lost = lost ?? false;

    //temp:
    //cardnumber = Math.floor((Math.random()*100) + 1);

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');


    var width = 150;
    var height = 250;

    //small layer
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(0,0,canvas.width, canvas.height);

    if (lost)
        context.fillStyle = '#DF1141';
    else
        context.fillStyle = '#112F41';

    //Calculate random rotation between -15° and 15°
    var rotation = Math.floor((Math.random() * 300) - 150);
    rotation /= 10;
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
 //context.rotate(-Math.PI/2);
    context.rotate(degrees_to_radians(rotation));
// context.textAlign = "center";
 //context.fillText("Your Label Here", labelXposition, 0);

    //Draw the card..
    context.fillRect(
        - width / 2,
        - height / 2, 
        width, height);

    // context.fillRect(
    //     (canvas.width / 2) - width / 2,
    //     (canvas.height / 2) - height / 2, 
    //     width, height);


        //Draw the text..
        context.fillStyle = "#FFF";
        
        context.fillText(cardnumber, (-width / 2) + 10, (-height / 2) + 25);
        context.fillText(cardnumber, (-width / 2) + 10, (height / 2) - 10);
        context.fillText(cardnumber, (width / 2) - 20, (-height / 2) + 25);
        context.fillText(cardnumber, (width / 2) - 20, (height / 2) - 10);
        context.font = "45px arial";
        context.fillText(cardnumber,  - 30,  0);

        context.restore();
}