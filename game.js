let player;
let platforms = [];
let gravity = 0.8;
let jumpStrength = -12;
let isJumping = false;

function setup() {
  createCanvas(800, 600);
  player = new Player();
  for (let i = 0; i < 6; i++) {
    platforms.push(new Platform(150 * i + 100, 500 - i * 80));
  }
}

function draw() {
  background(255);
  
  // Update and draw player
  player.update();
  player.draw();

  // Update and draw platforms
  for (let i = platforms.length - 1; i >= 0; i--) {
    platforms[i].update();
    platforms[i].draw();

    // Collision detection
    if (
      player.velY > 0 &&
      player.y + player.h <= platforms[i].y &&
      player.y + player.h + player.velY >= platforms[i].y &&
      player.x + player.w > platforms[i].x &&
      player.x < platforms[i].x + platforms[i].w
    ) {
      player.y = platforms[i].y - player.h;
      player.velY = 0;
      isJumping = false;
    }

    // Remove off-screen platforms
    if (platforms[i].x + platforms[i].w < 0) {
      platforms.splice(i, 1);
      let lastX = platforms[platforms.length - 1].x;
      let newY = 400 + random(-75, 75);
      platforms.push(new Platform(lastX + 150, newY));
    }
  }

  // Game over
  if (player.y > height) {
    noLoop();
    textSize(48);
    fill(0);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
  }
}

function keyPressed() {
  if (key === ' ' && !isJumping) {
    player.velY = jumpStrength;
    isJumping = true;
  }
}

class Player {
  constructor() {
    this.x = 100;
    this.y = 500;
    this.w = 50;
    this.h = 50;
    this.velY = 0;
  }

  update() {
    this.velY += gravity;
    this.y += this.velY;
  }

  draw() {
    fill(0, 100, 255);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 100;
    this.h = 10;
    this.speed = 3;
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    fill(0);
    rect(this.x, this.y, this.w, this.h);
  }
}
