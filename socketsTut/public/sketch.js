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
	createCanvas(600, 600);
	background(51);
	socket = io.connect('http://localhost:3000');
	socket.on("mouse",newDrawing);
	t = new SpaceShip(true);
	f = new SpaceShip(false);
	console.log(t,f);
	console.log(gamePieces);
}

function newDrawing(data){
	noStroke();
	fill(40,12,70);
	ellipse(data.x,data.y,60,60);

}

function mouseDragged(){
	console.log("sending: ",mouseX,mouseY);
	fill(255);
	noStroke();
	ellipse(mouseX, mouseY,60,60)
	// create a message top send
	var data = {
		x: mouseX,
		y: mouseY
	}

	socket.emit("mouse",data);

}


function draw() {

}
