class GamePieces {
  float xpos;
  float ypos;
  float wdth;
  float ht;
  
  
  void update(){
  }
  
  void display(){
  }
}

class SpaceShip extends GamePieces {
  float speed;
  float health;
  boolean isMine;
  float reloadTimer;
  float reloadTimerMax;
  float destX;
  float destY;
  PImage SpaceShipImg;
  
  SpaceShip(boolean isMine_) {
    isMine = isMine_;
    wdth = 30;
    ht = 30;
    xpos = width/2;
    if (isMine) {
      ypos = height - 2*ht;
    } else {
      ypos = ht;
    }
    speed = 5;
    gamePieces.add(this);
    if (isMine) {
      reloadTimer = 11;
      reloadTimerMax = 10;
    } else {
      reloadTimer = 91;
      reloadTimerMax = random(60,120);
    }
    destX = random(width);
    destY = random(0, height/2);
    if (isMine) {
      health = 1000;
      SpaceShipImg = loadImage("Galaga_Ship.png");
    } else {
      health = 400;
      SpaceShipImg = loadImage("Enemy_Ship.png");
    }
  }
  
  void update() {
    if (isMine) {
      if (key == CODED) {
        if (keyPressed == true) {
          if (keyCode == RIGHT) {
            xpos += speed;
          } else {
            if (keyCode == LEFT) {
              xpos -= speed;
            } else {
              xpos = xpos;
            }
          }
        }
        if (mousePressed) {
          shoot(xpos + (wdth/2)+13, ypos - 40 - 7, -8);
        }
    }
   } else {
     shoot(xpos + wdth/2 + 14, ypos + ht + 15, 8);
     xpos = lerp(xpos, destX, 0.01);
     ypos = lerp(ypos, destY, 0.01);
     
     float dist = sqrt(pow(xpos - destX, 2) + pow(ypos - destY, 2));
     
     if (dist < 0.1) {
       destX = random(width);
       destY = random(0, height/2);
     }
   }
   reloadTimer++;
   if (health <= 0) {
     gamePieces.remove(this);
   }
  }
  
  void shoot(float xPos, float yPos, float direction_) {
    if (reloadTimer > reloadTimerMax) {
      new LaserBullet(xPos, yPos, direction_);
      reloadTimer = 0;
    }
  }
  
  void display() {
    image(SpaceShipImg, xpos, ypos, 60, 60);
  }
}
class LaserBullet extends GamePieces {
  float direction;
  LaserBullet(float xPos, float yPos, float direction_) {
    xpos = xPos;
    ypos = yPos;
    wdth = 3;
    ht = 20;
    direction = direction_;
    gamePieces.add(this);
  }
  
  void update() {
    ypos += direction;
    for (GamePieces gp : gamePieces) {
      boolean shotX = false;
      boolean shotY = false;
      
      if ((xpos > gp.xpos && xpos < gp.xpos + gp.wdth) || (xpos + wdth > gp.xpos && xpos + wdth < gp.xpos + gp.xpos)) {
        shotX = true;
      }
      if ((ypos > gp.ypos && ypos < gp.ypos + gp.ht) || (ypos + ht > gp.ypos && ypos + ht < gp.ypos + gp.ypos)) {
        shotY = true;
      }
      if (shotX && shotY && gp instanceof SpaceShip) {
        ((SpaceShip) gp).health -= 1;
      }
    }
    if (ypos < -ht || ypos > height) {
      gamePieces.remove(this);
    }
  }
  
  void display() {
    fill(0, 255, 0);
    rect(xpos, ypos, wdth, ht);
  }
}
class backStars extends GamePieces {
  float speed;
  backStars() {
    xpos = random(width);
    ypos = random(height);
    wdth = random(2,5);
    ht = wdth;
    speed = wdth;
    gamePieces.add(this);
  }
  void update() {
    ypos += speed;
    if (ypos > height) {
      ypos = -ht;
      xpos = random(width);
    }
  }
  void display() {
    fill(255, map(wdth, 2, 5, 255/2, 255));
    rect(xpos, ypos, wdth, ht);
  }
}