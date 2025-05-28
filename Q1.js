//Canvas variables 
canvasWidth = 800;
canvasHeight = 500;

//Bg variables 
let bg, font, bgMusic, bulletMusic;
let bgx1 = 0;
let bgx2;
let scrollSpeed = 2;
let pulse = 0;

// score variable
let score = 0;

// Button variables
let startButton, startButtonHover;
let startButtonX, startButtonY, buttonWidth, buttonHeight;

let howToPlayButton, howToPlayButtonHover;
let HowToPlayX, HowToPlayY;

let leaderboardButton, leaderboardButtonHover;
let leaderboardX, leaderboardY;

let restartButton, restartButtonHover;
let restartButtonX, restartButtonY;

let homeButton;
let homeButtonX, homeButtonY
let homeButtonWidth = 25;
let homeButtonHeight = 25;

let musicOnButton, musicOffButton;
let musicOnButtonX, musicOnButtonY;
let musicOnButtonWidth = 25;
let musicOnButtonHeight = 25;
let musicsPlaying = true;

//game state variables 
let currentScreen;
let targetScreen;
let loadingStartTime;
const loadingDuration = 2000; // 2 seconds

const GAME_INTRO = 0;
const GAME_PLAY = 1;
const GAME_HOWTOPLAY = 2;
const GAME_LEADERBOARD = 3;
const GAME_LOADING = 4;
const GAME_OVER = 5;

//player variables 
let player, playerImg;
let playerX = 50, playerY = 250;
let playerWidth = 50;
let playerHeight = 50;
let playerSpeed = 5;
let lives = 3;

//bullet variables
let bulletImg;
let bulletsGroup;
let bulletPosition = 0;
let bulletWidth = 10;
let bulletHeight = 20;
let bulletSpeed = 10;
let bulletFired = false;

//gem variables
let gemImgs = [];
let gems;
let gemSpeed = scrollSpeed + 0.5;
let collectGemSound;

let lifeGemImg;
let lifeGem;
let lifeGemSound;

//asteroid variables
let asteroidImg = [];
let asteroids;
let asteroidSpeed = scrollSpeed + 1;

let explodeAnim;
let explodeSound;

//leaderboard variables
let leaderboardData;

//How to play video variables
let tutorial;
let tutorialStarted = false;


//Loading screen variables
function preload() {
  bg = loadImage("bg.png");
  font = loadFont("Minecraft.ttf"); 
  bgMusic = loadSound("music.wav");
  bulletMusic = loadSound("laserbullet.wav");
  leaderboardData = loadJSON("leaderboard.json");
  
  startButton = loadImage("start.png");
  startButtonHover = loadImage("startHover.png");

  howToPlayButton = loadImage("howToPlay.png");
  howToPlayButtonHover = loadImage("howToPlayHover.png");

  leaderboardButton = loadImage("leaderboard.png");
  leaderboardButtonHover = loadImage("leaderboardHover.png");

  restartButton = loadImage("start.png");
  restartButtonHover = loadImage("startHover.png");

  homeButton = loadImage("HomeButton.png");

  musicOnButton = loadImage("musicOn.png");
  musicOffButton = loadImage("musicOff.png");

  playerImg = loadImage("spaceship.png");

  bulletImg = loadImage("bullet.png");

  gemImgs[0] = loadImage("gem1.png");
  gemImgs[1] = loadImage("gem2.png");
  gemImgs[2] = loadImage("gem3.png");

  collectGemSound = loadSound("collectGem.mp3");

  
  lifeGemImg = loadImage("special.png"); 
  lifeGemSound = loadSound("lifegem.mp3");

  asteroidImg[0] = loadImage("A1.png");
  asteroidImg[1] = loadImage("A2.png");
  asteroidImg[2] = loadImage("A3.png");

  explodeAnim = loadAnimation(
    "explosion000.png",
    "explosion001.png",
    "explosion002.png",
    "explosion003.png",
    "explosion004.png",
    "explosion005.png",
    "explosion006.png",
    "explosion007.png",
    "explosion008.png",
    "explosion009.png",
    "explosion010.png",
    "explosion011.png"
  );

  explodeSound = loadSound("explode.mp3");

}



function setup() {
  // basic setup
  createCanvas(canvasWidth, canvasHeight).position(windowWidth/2 - canvasWidth/2, windowHeight/2 - canvasHeight/2);
  bgx2 = canvasWidth;
  currentScreen = GAME_INTRO;
  bgMusic.loop();
  bgMusic.setVolume(0.1);

  // create the player sprite
  player = createSprite(playerX, playerY, playerWidth, playerHeight);
  player.addImage(playerImg);
  player.scale = 1;

  // Creates groups for bullets, gems, and asteroids
  bulletsGroup = new Group();
  gems = new Group();
  asteroids = new Group();
  
  // Set the collider for the player sprite
  player.setCollider("rectangle", 0, 0, playerWidth, playerHeight);
  
  // Tutorial video
  tutorial = createVideo("tutorial.mp4");
  tutorial.hide();
  tutorial.volume(0);
  tutorial.loop();

}

// Main draw function - game state handling
function draw() {
  if (currentScreen === undefined) {
    currentScreen = GAME_INTRO;
  }
  
  // Different game screens handling
  switch (currentScreen) {
    case GAME_INTRO:
      IntroGameScene();
      break;
      
    case GAME_LOADING:
      drawLoadingScreen();
      break;
      
    case GAME_PLAY:
      startGameScene();
      gemSpawn();
      bgScroll();
      HOMEBUTTON();
      drawScore();
      asteroidSpawn();
      playerLives();
      drawSprites();
      break;
      
    case GAME_HOWTOPLAY:
      HowToPlayScene();
      break;
      
    case GAME_LEADERBOARD:
      leaderboardScene();
      break;
      
    case GAME_OVER:
      gameOver();
      HOMEBUTTON();
      break;
  }
}


// Scrolling background effect
function bgScroll() {
  image(bg, bgx1, 0, canvasWidth, canvasHeight);
  image(bg, bgx2, 0, canvasWidth, canvasHeight);

  bgx1 -= scrollSpeed;
  bgx2 -= scrollSpeed;

  // Reset positions when off-screen for continuous loop
  if (bgx1 < -canvasWidth) {
    bgx1 = canvasWidth;
  }
  if (bgx2 < -canvasWidth) {
    bgx2 = canvasWidth;
  }
}


// INTRO SCENE
function IntroGameScene() {

  background(bg);
  textFont(font);

  // TITLE
  pulse += 0.05;
  let scaleSize = 1 + 0.05 * sin(pulse);

  push();
  translate(width / 2, height / 3);
  scale(scaleSize);
  textSize(65);
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0, 255, 255);
  strokeWeight(2);
  text("Space Miner", 0, -50);
  pop();

  //START BUTTON 
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0);

  startButtonX = width / 2 - 100;
  startButtonY = height / 2 - 30;
  buttonWidth = 200;
  buttonHeight = 50;

  // Check if the mouse is hovering over the button
  // and change the image accordingly
  if (mouseHover(startButtonX, startButtonY, buttonWidth, buttonHeight)) {
    image(startButtonHover, startButtonX, startButtonY, buttonWidth, buttonHeight);
  } else {
    image(startButton, startButtonX, startButtonY, buttonWidth, buttonHeight);
  }
  push();
  stroke(0, 255, 0);
  strokeWeight(1);
  text("Start", startButtonX + buttonWidth / 2, startButtonY + buttonHeight / 2);
  pop();

  //HOW TO PLAY BUTTON
  textSize(28);
  textAlign(CENTER, CENTER);
  fill(0);

  HowToPlayX = startButtonX;
  HowToPlayY = height / 2 + 30;
  buttonWidth = 200;
  buttonHeight = 50;

  // Check if the mouse is hovering over the button
  // and change the image accordingly
  if (mouseHover(HowToPlayX, HowToPlayY, buttonWidth, buttonHeight)) {
    image(howToPlayButtonHover, HowToPlayX, HowToPlayY, buttonWidth, buttonHeight);
  } else {
    image(howToPlayButton, HowToPlayX, HowToPlayY, buttonWidth, buttonHeight);
  }
  push();
  stroke(0, 100, 255);
  strokeWeight(1);
  text("How to play", HowToPlayX + buttonWidth / 2, HowToPlayY + buttonHeight / 2);
  pop();

  //LEADERBOARD BUTTON
  textSize(25);
  textAlign(CENTER, CENTER);
  fill(0);

  leaderboardX = startButtonX;
  leaderboardY = height / 2 + 90;
  buttonWidth = 200;
  buttonHeight = 50;

  // Check if the mouse is hovering over the button
  // and change the image accordingly
  if (mouseHover(leaderboardX, leaderboardY, buttonWidth, buttonHeight)) {
    image(leaderboardButtonHover, leaderboardX, leaderboardY, buttonWidth, buttonHeight);
  } else {
    image(leaderboardButton, leaderboardX, leaderboardY, buttonWidth, buttonHeight);
  }
  push();
  stroke(200, 0, 0);
  strokeWeight(1);
  text("Leaderboard", leaderboardX + buttonWidth / 2, leaderboardY + buttonHeight / 2);
  pop();

  musicButton();

}


// GAME SCENE
function startGameScene() {
  background(bg); // draw bg

  // player controls
  if (keyIsDown(LEFT_ARROW)) {
    player.position.x -= playerSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.position.x += playerSpeed;
  }
  if (keyIsDown(UP_ARROW)) {
    player.position.y -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.position.y += playerSpeed;
  }

  // player boundary check
  if (player.position.x < 0) {
    player.position.x = 0;
  }
  if (player.position.x > width) {
    player.position.x = width;
  }
  if (player.position.y < 0) {
    player.position.y = 0;
  }
  if (player.position.y > height) {
    player.position.y = height;
  }

  // player and gem collision (score based on gem type)
  // life gem gives an extra life
  player.overlap(gems, function(player, gem) {
    if (gem.type === 0) {
      score += 5;
      collectGemSound.play();
    } else if (gem.type === 1) {
      score += 10;
      collectGemSound.play();
    } else if (gem.type === 2) {
      score += 15;
      collectGemSound.play();
    } else if (gem.type === "lifeGem") {
      lives += 1;
      lifeGemSound.play();
    }
    gem.remove();
  });

  // player and asteroid collision (lose life)
  // if lives < 0, game over
  player.overlap(asteroids, function(player, asteroid) {
    explosion(asteroid.position.x, asteroid.position.y);
    lives -= 1;
    explodeSound.play();

    if (lives < 0) {
      currentScreen = GAME_OVER;
    }
    asteroid.remove();
  });

  // bullet and asteroid collision
  // destroy asteroids 
  bulletsGroup.overlap(asteroids, function(bullet, asteroid) {
    explosion(asteroid.position.x, asteroid.position.y);
    asteroid.remove();
    explodeSound.play();
  });

}


// GEM SPAWN
function gemSpawn(){
  // spawn gem every 60 frames
  if (frameCount % 60 === 0) {
    let gem = createSprite(width + 50, random(50, height - 50), 10, 10);

    let type = floor(random(gemImgs.length)); // random gem type
    gem.addImage(gemImgs[type]); // add random gem image
    gem.type = type;

    gem.scale = random(0.5, 0.5);
    gem.velocity.x = -gemSpeed;
    gem.life = 500;

    gems.add(gem);
  }

  // Spawn life gem if lives < 1 and no life gem exists
  if (lives < 1 && !lifeGem){
    lifeGem = createSprite(width + 50, random(50, height - 50), 10, 10);
    lifeGem.addImage(lifeGemImg);
    lifeGem.scale = 0.9;
    lifeGem.velocity.x = -gemSpeed;
    lifeGem.life = 500;
    lifeGem.type = "lifeGem";
    gems.add(lifeGem);
  }
}

// ASTEROID SPAWN
function asteroidSpawn(){
  // spawn asteroid every 60 frames
  if (frameCount % 60 === 0) {
    let asteroid = createSprite(width + 50, random(50, height - 50), 10, 10);

    let type = floor(random(asteroidImg.length)); // random asteroid type
    asteroid.addImage(asteroidImg[type]); // add random asteroid image
    asteroid.type = type;

    asteroid.scale = random(0.5, 0.5);
    asteroid.velocity.x = -asteroidSpeed;
    asteroid.life = 500;

    asteroids.add(asteroid);
  }
}

//explosion handle 
function explosion(x, y) {
  let explosion = createSprite(x, y, 15, 15);
  explosion.addAnimation("explode", explodeAnim);
  explosion.animation.frameDelay = 2;
  explosion.animation.play();
  explosion.life = explosion.animation.getLastFrame() * 2; // Set the life of the explosion sprite
}

// SCORE
function drawScore() {
  textFont(font);
  textSize(20);
  fill(255);
  textAlign(RIGHT, TOP);
  text("Score: " + score, 690, 20);
}

//LIVES
function playerLives() {
  textFont(font);
  textSize(20);
  fill(255, 0, 0);
  textAlign(RIGHT, TOP);
  text("Lives: " + lives, 780, 20);
}


// How TO PLAY SCENE
function HowToPlayScene() {
  background(bg);

// if the tutorial video is not started, play it (as well as video settings)
  if (!tutorialStarted) {
    tutorial.play();
    tutorial.time(0);
    tutorial.volume(0.5);
    tutorialStarted = true;
  }
  
  // Draw the tutorial video
  image(tutorial, 150, 160, 500, 300);

  // TITLE
  pulse += 0.05;
  let scaleSize = 1 + 0.05 * sin(pulse);

  push();
  translate(width / 2, height / 5);
  scale(scaleSize);
  textSize(65);
  textFont(font);
  textAlign(CENTER, TOP);
  fill("white");
  stroke("green");
  strokeWeight(2);
  text("- HOW TO PLAY -", 0, -50);
  pop();

  bgMusic.stop();
  HOMEBUTTON();
}


// LEADERBOARD SCENE
function leaderboardScene() {
  background(bg);
  textFont(font);

  // TITLE and pulse effect animation
  pulse += 0.05;
  let scaleSize = 1 + 0.05 * sin(pulse);

  push();
  translate(width / 2, height / 5);
  scale(scaleSize);
  textSize(65);
  textAlign(CENTER, TOP);
  fill(218, 165, 32);
  stroke(255, 204, 0);
  strokeWeight(2);
  text("- LEADERBOARD -", 0, -50);
  pop();
  HOMEBUTTON();

  // Column headers
  textAlign(LEFT, TOP);
  fill(255);
  text("Rank", 100, 150);
  text("Name", 200, 150);
  text("Score", 400, 150);
  text("Time", 600, 150);

  // display leaderboard data 
  let leaderboardArray = leaderboardData.leaderboard;
  textSize(20);

  // Sort the leaderboard array by score in descending order
  for (let i = 0; i < leaderboardArray.length; i++) {
    let player = leaderboardArray[i];
    let playerName = player.playerName;
    let playerScore = player.score;
    let playerDate = player.date;

    let y = 200 + i * 30;

    textAlign(LEFT, TOP);
    fill(255, 195, 0);
    text(i + 1, 100, y); // Rank
    fill(255, 7, 58);
    text(playerName, 200, y); // Player name
    fill(63, 0, 255);
    text(playerScore.toLocaleString(), 400, y); // Format score with commas
    fill(57, 255, 20);
    text(playerDate, 600, y); // Player Date
  }
  musicButton();
}

// LOADING SCREEN
function drawLoadingScreen() {
  background(0);
  textAlign(CENTER, CENTER);
  textFont(font);
  fill(255);
  textSize(36);
  text("Loading...", width / 2, height / 2);

  //checks if loading time has passed to switch to the target screen
  if (millis() - loadingStartTime > loadingDuration) {
    currentScreen = targetScreen;
  }
}



// GAME OVER SCENE
function gameOver() {
  background(bg);
  textFont(font);
  textSize(65);
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0, 255, 255);
  strokeWeight(2);
  text("Game Over", width / 2, height / 3);

  push();
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0, 255, 0);
  strokeWeight(1);
  text("Score: " + score, width / 2, height / 2 - 20);
  pop();

  // Restart button
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0);

  restartButtonX = width / 2 - 100;
  restartButtonY = height / 2 + 20;
  buttonWidth = 200;
  buttonHeight = 50;

  // Check if the mouse is hovering over the button
  // and change the image accordingly
  if (mouseHover(restartButtonX, restartButtonY, buttonWidth, buttonHeight)) {
    image(restartButtonHover, restartButtonX, restartButtonY, buttonWidth, buttonHeight);
  } else {
    image(restartButton, restartButtonX, restartButtonY, buttonWidth, buttonHeight);
  }

  push();
  stroke(0, 255, 0);
  strokeWeight(1);
  text("Restart", restartButtonX + buttonWidth / 2, restartButtonY + buttonHeight / 2);
  pop();
}


function mousePressed() {
  //Handles click on intro screen buttons
  if (currentScreen === GAME_INTRO) {
    if (mouseHover(startButtonX, startButtonY, buttonWidth, buttonHeight)) {
      loadingStartTime = millis();
      targetScreen = GAME_PLAY;
      currentScreen = GAME_LOADING;
    } else if (mouseHover(HowToPlayX, HowToPlayY, buttonWidth, buttonHeight)) {
      loadingStartTime = millis();
      targetScreen = GAME_HOWTOPLAY;
      currentScreen = GAME_LOADING;
    } else if (mouseHover(leaderboardX, leaderboardY, buttonWidth, buttonHeight)) {
      loadingStartTime = millis();
      targetScreen = GAME_LEADERBOARD;
      currentScreen = GAME_LOADING;
    }
  }

  // Handles click on game over screen buttons
  if (currentScreen === GAME_OVER) {
    if (mouseHover(restartButtonX, restartButtonY, buttonWidth, buttonHeight)) {
      resetGame();
      loadingStartTime = millis();
      targetScreen = GAME_PLAY;
      currentScreen = GAME_LOADING;
    }
  }

  // Handles click on home button
  if ((currentScreen === GAME_LEADERBOARD || currentScreen === GAME_PLAY ||currentScreen === GAME_OVER) &&
    mouseHover(homeButtonX, homeButtonY, homeButtonWidth, homeButtonHeight)) 
    {
    loadingStartTime = millis();
    targetScreen = GAME_INTRO;
    currentScreen = GAME_LOADING;
    tutorial.pause();
    tutorial.volume(0);
    resetGame();
  }
  else if (currentScreen === GAME_HOWTOPLAY && mouseHover(homeButtonX, homeButtonY, homeButtonWidth, homeButtonHeight)) {
    loadingStartTime = millis();
    targetScreen = GAME_INTRO;
    currentScreen = GAME_LOADING;
    tutorial.pause();
    tutorial.volume(0);
    tutorialStarted = false;
    bgMusic.loop();
    resetGame();
  }



  // Handles click on music button
  if (mouseHover(musicOnButtonX, musicOnButtonY, musicOnButtonWidth, musicOnButtonHeight)) {
    if (musicsPlaying) {
      bgMusic.stop();
      musicsPlaying = false;
    } else {
      bgMusic.loop();
      musicsPlaying = true;
    }
  }
}



// Resets game variables
function resetGame() {
  score = 0;
  lives = 3;
  lifeGem = null;
  player.position.x = playerX;
  player.position.y = playerY;
  bulletsGroup.removeSprites();
  gems.removeSprites();
  asteroids.removeSprites();
}

// MOUSE HOVER FUNCTION - checks if the mouse is within the bounds of a rectangle (button)
function mouseHover(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

// HOME BUTTON
function HOMEBUTTON(){
  homeButtonX = 20;
  homeButtonY = 20;
  image(homeButton, homeButtonX, homeButtonY, homeButtonWidth, homeButtonHeight);

}

// MUSIC BUTTON
function musicButton(){
  musicOnButtonX = 760;
  musicOnButtonY = 20;

  // Check if the mouse is hovering over the button
  // and change the image accordingly
  if (musicsPlaying) {
    image(musicOnButton, musicOnButtonX, musicOnButtonY, musicOnButtonWidth, musicOnButtonHeight);
  }
  else {
    image(musicOffButton, musicOnButtonX, musicOnButtonY, musicOnButtonWidth, musicOnButtonHeight);
  }
}

// Handles spacebar press to shoot bullets
function keyPressed(){
  if (keyCode === 32 && keyIsPressed) { // Space key
   let bullet = createSprite(player.position.x, player.position.y, bulletWidth, bulletHeight);
   bullet.addImage(bulletImg);
   bullet.setSpeed(bulletSpeed, 0);
   bullet.scale = 0.1;
   bullet.life = width / bulletSpeed;
   bulletsGroup.add(bullet);
   bulletMusic.play();
  }

}
