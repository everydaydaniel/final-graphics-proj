var socket;
var t;
var f;
var goodShip, badShip;
var difficulty = 1;
var level = 1;
function preload() {
  // preload the ship images
  badShip = loadImage("assets/Enemy_Ship.png");
  goodShip = loadImage("assets/Galaga_Ship.png");
  // load sound
  soundFormats("mp3");
  song = loadSound("assets/Galaga_Music.mp3");
}

function setup() {
  createCanvas(600, 600);
  song.setVolume(.01);
  song.play();
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
		level += 1;
	 }
	 if (allDead(gamePieces)){
		 gameOver();
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
