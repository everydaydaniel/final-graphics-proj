// porting the game from processing to p5.js
const gamePieces = []
const stars = []

function SpaceShip(isMine) {
  // initialize the object
  this.isMine = isMine;
  this.width = 30;
  this.ht = 30;
  this.xpos = width / 2;
  // if it is a player set variables
  if (this.isMine) {
    this.ypos = height - 2 * this.ht;
    this.reloadTimer = 11;
    this.reloadTimerMax = 10;
    this.health = 1000;
    this.SpaceShipImg = goodShip;


    // if it is an enemy ship.
  } else {
    this.ypos = this.ht;
    this.reloadTimer = 91;
    this.reloadTimerMax = random(60, 120);
    this.health = 400;
    this.SpaceShipImg = badShip;
  }

  this.speed = 5;


  this.destX = random(width);
  this.destY = random(0, height / 2);

  // add to the gamePieces array.
  gamePieces.push(this);

  // update position
  this.update = function() {

    if (this.isMine) {
      function keyPressed() {
        if (keyCode == RIGHT_ARROW) {
          this.xpos += speed;
          console.log(this.xpos);
        } else if (keyCode == LEFT_ARROW) {
          this.xpos -= speed;
          console.log(this.xpos);
        }
      }
    }

  }

}


function backStars() {
  // used to create the background stars.
  this.xpos = random(width);
  this.ypos = random(height);
  this.wdth = random(2, 5);
  this.ht = this.wdth;
  this.speed = this.wdth;
  this.rotation = 0
  stars.push(this);

  // update the stars
  this.update = function() {
    this.ypos += this.speed;
    if (this.ypos > height) {
      this.ypos = -this.ht;
      this.xpos = random(width);
    }
  }

  // display stars
  this.display = function() {
    fill(255, map(this.wdth, 2, 5, 255 / 2, 255));
    rect(this.xpos, this.ypos, this.wdth, this.ht);
    stroke(255);
    push();
    translate(this.xpos + 2, this.ypos + 2);
    rotate(-this.rotation);
    line(0, 5, 0, -5);
    line(-5, 0, 5, 0);
    pop();
    push();
    translate(this.xpos + 2, this.ypos + 2);
    rotate(-this.rotation);
    line(0, 5, 0, -5);
    line(-5, 0, 5, 0);
    pop();
    this.rotaion += .06;
    noStroke();

  }




}
