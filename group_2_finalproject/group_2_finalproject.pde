ArrayList<GamePieces> gamePieces;
import processing.sound.*;
SoundFile file;

void setup() {
  size(800,800);
  gamePieces = new ArrayList<GamePieces>();
  for (int i = 0; i < 90; i++) {
    new backStars();
  }
  new SpaceShip(true);
  for (int i = 0; i<6; i++) {
    SpaceShip enemy = new SpaceShip(false);
    enemy.xpos = i * width/8.0 + width/32.0;
  }
  file = new SoundFile(this, "Galaga_Music.mp3");
  file.play();
}

void draw() {
  background(0);
  for (int i = 0; i<gamePieces.size(); i++) {
    GamePieces gp = gamePieces.get(i);
    gp.display();
    gp.update();
  }
}