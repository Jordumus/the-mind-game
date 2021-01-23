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
          
          context.textAlign = "left";
          context.fillText(cardnumber, (-width / 2) + 10, (-height / 2) + 25);
          context.fillText(cardnumber, (-width / 2) + 10, (height / 2) - 10);

          context.textAlign = "right";
          context.fillText(cardnumber, (width / 2) - 10, (-height / 2) + 25);
          context.fillText(cardnumber, (width / 2) - 10, (height / 2) - 10);
          context.font = "45px arial";
          
          context.textAlign = "center";
          context.fillText(cardnumber,  /*- 30*/ 0,  0);
  
          context.restore();
          //ctx.textAlign = "left";
  }