var socket;
var t;
var f;
var goodShip, badShip;
function preload(){
	// preload the ship images
	goodShip = loadImage("assets/Enemy_Ship.png");
	badShip = loadImage("assets/Galaga_Ship.png");
}

function setup() {
	createCanvas(800, 800);
	t = new SpaceShip(true);
	f = new SpaceShip(false);
	console.log(t,f);

	// create stars.
	for (var i = 0; i < 90; i++) {
		new backStars();
	}
	console.log(gamePieces);
	console.log(stars);
}


function draw() {
	background(0);
	for (var i = 0; i < stars.length; i++) {
		stars[i].display();
		stars[i].update();

	}
}
