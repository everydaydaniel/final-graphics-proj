// porting the game from processing to p5.js
const gamePieces = []

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
  // if it is an enemy ship.
  } else {
    this.ypos = this.ht;
    this.reloadTimer = 91;
    this.reloadTimerMax = random(60,120);
  }

  this.speed = 5;


  this.destX = random(width);
  this.destY = random(0,height/2);

  if (isMine){
    this.health = 1000;
    this.SpaceShipImg = goodShip;

  }
  else{
    this.health = 400;
  }


  // add to the gamePieces array.
  gamePieces.push(this);

}
