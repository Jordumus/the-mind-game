var socket = io();
socket.on('message', function (data) {
    console.log(data);
    document.getElementById("message").innerText = data;
});

socket.on('cards', function (data) {

    var htmlString = "";
    var newHtmlString = "";
    var first = true;
    for (card in data) {

        /*htmlString += `<button class="card" 
            value='${data[card]}'
            onClick='sendCard(${data[card]})'
            ${(first) ? "" : "disabled='disabled'"}>
                ${data[card]}</button>`;*/

        newHtmlString += `<div 
            class="playcard ${(first)? "" : "cardDisabled"}" 
            ${(first) ? 'onClick="sendCard('+data[card]+')"':""}><p>${data[card]}</p></div>`;

        first = false;
    }

    document.getElementById("cards").innerHTML = htmlString + newHtmlString;

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

    document.getElementById("lastCard").innerText = data.card;
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

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function cleanCanvas(){
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
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

//     var width = 75;//canvas.width;
// var height = 125;//canvas.height;

// context.fillStyle = '#112F41';
// context.fillRect(0, 0, width, height);

// context.globalCompositeOperation = 'screen';
// context.lineWidth = 10;

// tapufini();

// context.globalCompositeOperation = "source-over";
//  //Clear surroundings:
//  context.fillStyle = '#FFF';
//  context.fillRect(75, 0, canvas.width - 75, canvas.height);
//  context.fillRect(0, 125, canvas.width, canvas.height );


// function tapufini() {
//   // Vars
//   var amplitude = rangeFloor(10, 20);
//   var frequency = rangeFloor(30, 70);
//   var colors = [
//     '#FFB713',
//     '#009F45',
//     '#FF3A5C',
//     '#4646DF',
//     '#F44918',
//     '#FEAC00',
//     '#FF5630',
//     '#396C7D',
//     '#83757D',
//     '#2C3F54',
//     '#F0F0EC',
//     '#2A2A41',
//     '#766B4F',
//     '#F4AAAB',
//     '#CF3B45',
//     '#4F94CF',
//     '#E51D20',
//     '#2C416E',
//     '#EE751A',
//     '#FECF1A',
//   ];

//   let x = 0;

//   while (x < width + 100) {
//     let color = pick(colors);
//     drawSine(x, color);
//     x = x + 17;
//   }

 

//   // FUNCTIONS ************************

//   function drawSine(x, color) {
//     let waveY = -10;
//     context.beginPath();
//     while (waveY < height + 10) {
//       // Draw a very short line to the next point output by the sine function
//       let waveX = x + amplitude * Math.sin(waveY / frequency);
//       context.lineTo(waveX, waveY);
//       waveY++;
//     }
//     context.strokeStyle = color;
//     context.stroke();
//   }

//   function rangeFloor(min, max) {
//     // Return a random whole number between min and max
//     return Math.floor(Math.random() * (max - min) + min);
//   }

//   function pick(array) {
//     // Pick a random item out of an array
//     if (array.length === 0) return undefined;
//     return array[rangeFloor(0, array.length)];
//   }
// }
}