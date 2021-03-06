var readyTimer;
var readyHovered = false;
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var messageQueue = [];
var messageTimer;

canvas.onmousemove = canvasMouseMove;
canvas.onmouseup = canvasMouseClick;

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function cleanCanvas() {

    context.clearRect(0, 0, canvas.width, canvas.height);
}

function cleanCenter() {

    context.clearRect(100, 100, canvas.width - 200, canvas.height - 200);

}

function cleanBottom() {
    
    context.clearRect(0,canvas.height - 100, canvas.width, 100);
    var width = 0;
    var height = 0;

    //small layer
    context.fillStyle = "rgba(100, 100, 255, 0.5)";
    context.fillRect(0, canvas.height - 85, canvas.width, 50);
    context.beginPath();
    //context.strokeStyle = "rgba(4, 0, 255, 1.0)"; Doner blauw
    context.strokeStyle = "rgba(0, 0, 255, 1.0)";

    context.rect(0, canvas.height - 85, canvas.width, 50);
    context.stroke();
}

function drawOtherCardsOnCanvas(otherCards) {

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    //Let's clear the sides first:
    context.clearRect(0, 0, canvas.width, 100);
    context.clearRect(0, 0, 100, canvas.height);
    context.clearRect(canvas.width - 100, 0, 100, canvas.height);
    //context.clearRect(0, canvas.height - 100, canvas.width, 100);

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
        case 4:
            drawCardRegion(0, 50, 100, canvas.height - 100, otherCards[0], cardColors[0]);
            drawCardRegion(canvas.width - 20, 50, 100, canvas.height - 100, otherCards[1], cardColors[1]);
            drawCardRegion(50, 0, (canvas.width - 100) / 2, 100, otherCards[2], cardColors[2]);
            drawCardRegion(50 + ((canvas.width - 100) / 2), 0, (canvas.width - 100) / 2, 100, otherCards[3], cardColors[3]);
            break;

        case 5:
            drawCardRegion(0, 50, 100, (canvas.height - 100) / 2, otherCards[0], cardColors[0]);
            drawCardRegion(0, 50 + ((canvas.height - 100) / 2), 100, (canvas.height - 100) / 2, otherCards[1], cardColors[1]);

            drawCardRegion(canvas.width - 20, 50, 100, (canvas.height - 100) / 2, otherCards[2], cardColors[2]);
            drawCardRegion(canvas.width - 20, 50 + ((canvas.height - 100) / 2), 100, (canvas.height - 100) / 2, otherCards[3], cardColors[3]);

            drawCardRegion(50, 0, canvas.width - 100, 100, otherCards[4], cardColors[4]);
            break;
            
        case 6:
            drawCardRegion(0, 50, 100, (canvas.height - 100) / 2, otherCards[0], cardColors[0]);
            drawCardRegion(0, 50 + ((canvas.height - 100) / 2), 100, (canvas.height - 100) / 2, otherCards[1], cardColors[1]);

            drawCardRegion(canvas.width - 20, 50, 100, (canvas.height - 100) / 2, otherCards[2], cardColors[2]);
            drawCardRegion(canvas.width - 20, 50 + ((canvas.height - 100) / 2), 100, (canvas.height - 100) / 2, otherCards[3], cardColors[3]);

            drawCardRegion(50, 0, (canvas.width - 100) / 2, 100, otherCards[4], cardColors[4]);
            drawCardRegion(50 + ((canvas.width - 100) / 2), 0, (canvas.width - 100) / 2, 100, otherCards[5], cardColors[5]);
            break;
    }
}

function drawCardRegion(x, y, width, height, player, color) {

    var interspace = 10;
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var horizontal = (width > height);

    var amount = player.cards;

    var usefulSize = (horizontal) ? width : height;

    //Let's try to calculate our card width.
    var cardWidth = (usefulSize - (interspace * amount)) / amount;
    cardWidth = (cardWidth > 50) ? 50 : cardWidth;

    //Calculate our startpoint for drawing
    var usedWidth = (interspace * amount) + (cardWidth * amount);
    var startPoint = (usefulSize - usedWidth) / 2;

    startPoint += (horizontal) ? x : y;

    context.fillStyle = color;

    for (var i = 0; i < amount; i++) {

        if (horizontal)
            context.fillRect(startPoint, y, cardWidth, 20);
        else
            context.fillRect(x, startPoint, 20, cardWidth);

        startPoint += cardWidth + interspace;

    }

    //context.fillText(player.name, (x == 0) ? 50: canvas.width - 50


}


function readyAnimation() {

    var currentCount = 3;
    var currentSize = 20;

    context.save();
    readyTimer = setInterval(function () {


        cleanCenter();
        context.font = currentSize + "px arial";
        context.textAlign = "center";

        context.fillStyle = "#F50";

        context.fillText(currentCount, canvas.width / 2, (canvas.height / 2) /*- (currentSize / 2)*/)


        if (currentSize++ >= 100) {
            currentSize = 20;
            currentCount--;
        }

        if (currentCount == 0) {
            clearInterval(readyTimer);
            cleanCenter();
            context.font = "120px arial";
            context.textAlign = "center";
            context.fillStyle = "#0B0";
            context.fillText("GO", canvas.width / 2, (canvas.height / 2) /*- (currentSize / 2)*/)
            context.restore();
            changeGameState(cGAMESTATES.INGAME);

        }

    }, 10);
}

function drawCardOnCanvas(cardnumber, lost) {

    //Check for lost
    lost = lost ?? false;

    var width = 150;
    var height = 250;

    //small layer
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(100, 100, canvas.width-200, canvas.height-200);

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

    context.textAlign = "left";
    context.fillText(cardnumber, (-width / 2) + 10, (-height / 2) + 15);
    context.fillText(cardnumber, (-width / 2) + 10, (height / 2) - 10);

    context.textAlign = "right";
    context.fillText(cardnumber, (width / 2) - 10, (-height / 2) + 15);
    context.fillText(cardnumber, (width / 2) - 10, (height / 2) - 10);
    context.font = "45px arial";

    context.textAlign = "center";
    context.fillText(cardnumber,  /*- 30*/ 0, 0);

    context.restore();
    //ctx.textAlign = "left";
}

function WriteTextMessage(text,type) {

    cleanBottom();

    context.save();

    context.font = "35px arial"

    if (!type)
        context.fillStyle = "#000";
    else if (type == "warning")
        context.fillStyle = "#AA0";
    else if (type == "error")
        context.fillStyle = "#F00";
        
    context.textAlign = "center";

    context.fillText(text, canvas.width / 2, canvas.height - 50, canvas.width - 100);
    context.restore();
}

function canvasMouseMove(e) {

    //readyHovered = false;

    if (gameState == cGAMESTATES.WAITING_FOR_READY){
        
        if (cursorCheck(e, 100, 100, canvas.width - 200, canvas.height - 200)){
            canvas.style.cursor = "pointer";

            if (!readyHovered){
                readyHovered = true;
                drawReadyButton();
            }
            

        }
        else{
            canvas.style.cursor = "default";
            if (readyHovered){
                readyHovered = false;
                drawReadyButton();
            }
        }
    }
}

function drawReadyButton(){
    
    cleanCenter();
    
    context.save();

    context.font = "75px comic sans";
    context.textAlign = "center";

    if (!readyHovered){
        context.fillStyle = "#D00";
        context.fillText("Ready?", canvas.width / 2, (canvas.height / 2) - 30, canvas.width - 200);
    }
    else{
        context.fillStyle = "#0D0";
        context.fillText("Ready!", canvas.width / 2, (canvas.height / 2) - 30, canvas.width - 200);
    }
    context.restore();

}

function drawWaiting(){
    
    cleanCenter();
    
    context.save();

    context.font = "75px comic sans";
    context.textAlign = "center";

    context.fillStyle = "#DD0";
    context.fillText("Waiting...", canvas.width / 2, (canvas.height / 2) - 30, canvas.width - 200);
    
    context.restore();

}


function canvasMouseClick(e) {

    if (gameState == cGAMESTATES.LOST ||gameState == cGAMESTATES.WON){
        changeGameState(cGAMESTATES.WAITING_FOR_READY);
    }
    else if (gameState == cGAMESTATES.WAITING_FOR_READY){
        
        clearTimeout(restartTimeout);
        socket.emit('start game');
        readyHovered = false;
    }
    
}

function cursorCheck(e, x,y,width,height){

    var BB=canvas.getBoundingClientRect();
    var offsetX=BB.left;
    var offsetY=BB.top;        

    var mouseX=parseInt(e.clientX-offsetX);
    var mouseY=parseInt(e.clientY-offsetY);

    if (mouseX > x && mouseX < x + width &&
        mouseY > y && mouseY < y + height){

            return true;
        }

    return false;
}