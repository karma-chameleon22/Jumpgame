let player;
let platforms = [];
let gravity = 0.8;
let jumpStrength = -12;
let isJumping = false;
let gameOver = false;
let restartButton;

let countdown = 3;        // countdown seconds
let countdownStartTime;   // track when countdown started
let gameStarted = false;

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(64);
  countdownStartTime = millis();
  setupGame();
}

function setupGame() {
  player = new Player();
  platforms = [];
  isJumping = false;
  gameOver = false;
  gameStarted = false;
  countdown = 3;
  countdownStartTime = millis();

  // Start on flat land
  for (let i = 0; i < 3; i++) {
    platforms.push(new Platform(i * 300, height - 50));
  }

  // Generate random platforms beyond flat land
  let lastX = 900;
  for (let i = 0; i < 10; i++) {
    let gap = random(80, 200);
    let heightVar = random(-100, 100);
    platforms.push(new Platform(lastX + gap, height - 100 + heightVar));
    lastX += gap;
  }

  if (restartButton) {
    restartButton.remove();
    restartButton = null;
  }
}

function draw() {
  background(240);

  if (!gameStarted) {
    // Show countdown
    let elapsed = floor((millis() - countdownStartTime) / 1000);
    let timeLeft = countdown - elapsed;

    if (timeLeft > 0) {
      fill(0);
      text(timeLeft, width / 2, height / 2);
    } else {
      gameStarted = true;
    }
    return; // Skip rest of draw until game starts
  }

  if (!gameOver) {
    player.update();
    player.draw();

    for (let i = platforms.length - 1; i >= 0; i--) {
      platforms[i].update();
      platforms[i].draw();

      // Collision
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

      // Remove off-screen
      if (platforms[i].x + platforms[i].w < 0) {
        platforms.splice(i, 1);

        let lastX = platforms[platforms.length - 1].x;
        let gap = random(100, 200);
        let newY = height - 100 + random(-100, 50);
        platforms.push(new Platform(lastX + gap, newY));
      }
    }

    // Game over check
    if (player.y > height) {
      gameOver = true;
      createRestartButton();
    }
  } else {
    textAlign(CENTER, CENTER);
    textSize(48);
    fill(0);
    text("Game Over", width / 2, height / 2 - 50);
  }
}

function keyPressed() {
  if (key === ' ' && !isJumping && !gameOver && gameStarted) {
    player.velY = jumpStrength;
    isJumping = true;
  }
}

function createRestartButton() {
  restartButton = createButton("Restart");
  restartButton.position(width / 2 - 40, height / 2 + 10);
  restartButton.mousePressed(() => {
    setupGame();
    countdownStartTime = millis();
    gameStarted = false;
  });
}

class Player {
  constructor() {
    this.x = 100;
    this.y = height - 100;
    this.w = 50;
    this.h = 50;
    this.velY = 0;
  }

  update() {
    this.velY += gravity;
    this.y += this.velY;
  }

  draw() {
    fill(255, 0, 0); // Red color
    rect(this.x, this.y, this.w, this.h);
  }
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = random(80, 150);
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
