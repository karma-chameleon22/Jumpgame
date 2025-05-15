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
let startDelay = 2000;    // delay (ms) after countdown before enabling jump & scrolling

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(64);
  setupGame();
}

function setupGame() {
  player = new Player();
  platforms = [];
  isJumping = false;
  gameOver = false;
  gameStarted = false;

  // Create starting platforms flat on bottom
  for (let i = 0; i < 3; i++) {
    platforms.push(new Platform(i * 300, height - 50));
  }

  // Player starts ON first platform:
  player.x = platforms[0].x + 20;
  player.y = platforms[0].y - player.h;
  player.velY = 0;

  // Generate random platforms beyond flat land
  let lastX = platforms[platforms.length - 1].x + 300;
  for (let i = 0; i < 10; i++) {
    let gap = random(80, 200);
    let heightVar = random(-100, 100);
    platforms.push(new Platform(lastX + gap, height - 100 + heightVar));
    lastX += gap;
  }

  countdownStartTime = millis();

  if (restartButton) {
    restartButton.remove();
    restartButton = null;
  }
}

function draw() {
  background(240);

  let elapsed = millis() - countdownStartTime;

  if (!gameStarted) {
    // Show countdown timer
    let count = countdown - floor(elapsed / 1000);
    if (count > 0) {
      fill(0);
      text(count, width / 2, height / 2);
    } else if (elapsed < countdown * 1000 + startDelay) {
      // After countdown, show "Get Ready" message during startDelay
      fill(0);
      textSize(48);
      text("Get Ready...", width / 2, height / 2);
      textSize(64);
      // Keep player on first platform
      player.x = platforms[0].x + 20;
      player.y = platforms[0].y - player.h;
      player.velY = 0;
    } else {
      // Start game after countdown + delay
      gameStarted = true;
      textSize(64); // Reset text size in case
    }
    player.draw();
    platforms.forEach(p => p.draw());
    return; // Skip rest until gameStarted
  }

  if (!gameOver) {
    // Update and draw player & platforms
    player.update();
    player.draw();

    for (let i = platforms.length - 1; i >= 0; i--) {
      platforms[i].update();
      platforms[i].draw();

      // Collision detection with platforms
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

      // Remove platforms off screen and add new ones
      if (platforms[i].x + platforms[i].w < 0) {
        platforms.splice(i, 1);

        let lastX = platforms[platforms.length - 1].x;
        let gap = random(100, 200);
        let newY = height - 100 + random(-100, 50);
        platforms.push(new Platform(lastX + gap, newY));
      }
    }

    // Game over if player falls below screen
    if (player.y > height) {
      gameOver = true;
      createRestartButton();
    }
  } else {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("Game Over", width / 2, height / 2 - 50);
  }
}

function keyPressed() {
  // Only allow jumping if game started, not jumping already, and not game over
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
    fill(255, 0, 0); // red color
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
    if (gameStarted) {
      this.x -= this.speed;
    }
  }

  draw() {
    fill(0);
    rect(this.x, this.y, this.w, this.h);
  }
}
