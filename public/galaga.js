// porting the game from processing to p5.js

var enemies = [];
var gamePieces = [];
var stars = [];
var lasers = [];

function SpaceShip(isPlayer, isRemote) {
  // initialize the object
  this.dead = false;
  this.isPlayer = isPlayer;
  this.isRemote = isRemote;
  this.width = 30;
  this.ht = 30;
  this.xpos = width / 2;
  // if it is a player set variables
  if (this.isPlayer) {
    this.ypos = height - 2 * this.ht;
    this.reloadTimer = 11;
    this.reloadTimerMax = 15;
    this.health = 300;
    this.SpaceShipImg = goodShip;
    this.direction = 8;
    // add to the gamePieces array.
    gamePieces.push(this);


    // if it is an enemy ship.
  } else {
    this.ypos = this.ht;
    this.reloadTimer = 91;
    this.reloadTimerMax = random(60, 120) - difficulty;
    this.health = 150 * difficulty;
    this.SpaceShipImg = badShip;
    this.direction = -8;
    // add to the enemy array
    enemies.push(this);
  }

  this.speed = 5;


  this.destX = random(width);
  this.destY = random(0, height / 2);


  // update position
  this.update = function() {
    // if (this.health < 350){
    //   console.log("its working");
    //   console.log(this.health);
    // }
    // check if it is a players game Piece
    if (this.isPlayer) {
      if (keyIsPressed === true && !this.isRemote) {

        if (keyCode == RIGHT_ARROW && this.xpos < width - 60) {

          this.xpos += this.speed;
          // console.log(this.xpos);

        } else if (keyCode == LEFT_ARROW && this.xpos > 0) {
          this.xpos -= this.speed;
          // console.log(this.xpos);
        }
      }
      // handle shooting here 32 == spacebar
      if (!this.isRemote && (mouseIsPressed || keyIsPressed && keyCode == 32)) {
        this.shoot();
      }
    }
    // enemy movement
    else {
      this.shoot();
      this.xpos = lerp(this.xpos, this.destX, 0.01);
      this.ypos = lerp(this.ypos, this.destY, 0.01);

      this.dist = sqrt(pow(this.xpos - this.destX, 2) + pow(this.ypos - this.destY, 2));

      if (this.dist < 0.1) {
        this.destX = random(width);
        this.destY = random(0, height / 2);
      }

    }
    this.reloadTimer += 1;
    if (this.health <= 0) {
      this.dead = true;
    }
  }
  // shoot the bullet boi
  this.shoot = function() {
    if (this.reloadTimer > this.reloadTimerMax) {
      // new laser LaserBullet
      new LaserBullet(this.xpos, this.ypos, this.direction, this.isPlayer);
      this.reloadTimer = 0;
      // console.log("Shoot");
    }

  }

  // display the ship
  this.display = function() {

    image(this.SpaceShipImg, this.xpos, this.ypos, 60, 60);
    // rect(this.xpos + 13, this.ypos + 5, 37, 40);

    if (this.isPlayer) {
      rect(30, 30, map(this.health, 0, 100, 0, this.wdth), 3);
    } else {
      rect(this.xpos, this.ypos - 3, map(this.health, 0, 100, 0, this.wdth), 3);
    }
  }

}

// laser bullet class
function LaserBullet(xpos, ypos, direction, isPlayer) {
  // assign what to loop through
  this.shotTarget = false;
  this.targets = gamePieces;
  this.ypos = ypos + 50;
  if (isPlayer) {
    this.targets = enemies;
    this.ypos -= 20
  }


  this.xpos = xpos + 30;
  this.ypos = ypos;
  this.direction = -1 * direction;
  this.wdth = 3;
  this.ht = 20;
  this.isLaserBullet = true;
  lasers.push(this);
  // console.log(direction);
  // Update function
  this.update = function() {
    this.ypos += this.direction;
    if (this.shotTarget == false) {
      // update bullet position


      // loop throught the targets
      for (var i = 0; i < this.targets.length; i++) {
        let shotX = false;
        let shotY = false;
        let gp = this.targets[i];

        if ((this.xpos > this.xpos + 13 && this.xpos < gp.xpos + 37) ||
          (this.xpos + this.wdth > gp.xpos + 13 &&
            this.xpos + this.wdth < gp.xpos + 37)) {
          shotX = true;
        }
        if ((this.ypos > gp.ypos && this.ypos < gp.ypos + 40) || (this.ypos + this.ht > gp.ypos && this.ypos + this.ht < gp.ypos + 40)) {
          shotY = true;
        }
        if (shotX && shotY) {
          gp.health -= 50;
          this.shotTarget = true;

        }
      }
      // if (this.ypos < -this.ht || this.ypos > height){
      //   let i = lasers.indexOf(this);
      //   if (i != -1){
      //     lasers = lasers.splice(i,1);
      //   }
      // }
    }
  }

  this.display = function() {
    fill(0, 255, 0);
    rect(this.xpos, this.ypos, this.wdth, this.ht);
  }

  this.removeLasers = function() {
    if (lasers.length > 70) {

      lasers = lasers.slice(-15);
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

function allDead(arr) {
  for (var i = 0; i < arr.length; i++) {

    if (arr[i].dead == false) {
      return false;
    }
    return true;
  }
}

function newLevel() {
  enemies = [];
  difficulty += .05;

  for (var i = 0; i < int(random(2, 6)); i++) {
    new SpaceShip(false);
  }
  // revive with health
  for (var i = 0; i < gamePieces.length; i++) {
    gamePieces[i].health = 300;
    gamePieces[i].dead = false;
  }
}

function gameOver(){
  textSize(30);
  text('GAME OVER YOU MADE IT TO LEVEL ' + level, 25,300);
}
