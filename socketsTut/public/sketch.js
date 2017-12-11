var socket;
var t;
var f;
var goodShip, badShip;
var difficulty = 1;

function preload() {
  // preload the ship images
  badShip = loadImage("assets/Enemy_Ship.png");
  goodShip = loadImage("assets/Galaga_Ship.png");
}

function setup() {
  createCanvas(600, 600);
  t = new SpaceShip(true);
  for (var i = 0; i < 1; i++) {
    new SpaceShip(false);
  }
  f = new SpaceShip(false);
  console.log(t, f);

  // create stars.
  for (var i = 0; i < 90; i++) {
    new backStars();
  }
  console.log(gamePieces);
  console.log(stars);
}


function draw() {
  background(0);
  // generate stars
  for (var i = 0; i < stars.length; i++) {
    stars[i].display();
    stars[i].update();
  }

  for (var i = 0; i < gamePieces.length; i++) {
    if (gamePieces[i].dead == false) {
      gamePieces[i].update();
      gamePieces[i].display();
    }
  }

	if (allDead(enemies)){
    console.log(difficulty)
		newLevel();
	 }
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].dead == false) {
      enemies[i].update();
      enemies[i].display();
    }
  }

  for (var i = 0; i < lasers.length; i++) {
    lasers[i].update();
    lasers[i].display();
    lasers[i].removeLasers();
  }

}
