// Assignment 3: Creating a Catcher Game
//
// Matthew Bodenstein (217996505 bodey@my.yorku.ca)
// 09/26/2023

/***
 "Stranded": Avoid Asteroid Game
---------------------------------------------
******** HOW TO PLAY ? ********
- Use the Mouse to control the UFO
- Avoid all the Asteroids
- Collect the Yellow Stars to get points
- Collect Blue Repair Token to gain health
- Try to survive as long as possible
- Have fun!

    **** Hardcore Mode ****
- Press 'K' in the start menu to activate hardcore mode!
- No Repair Token!
- More Asteroids!
- Only 1 Star to Collect!
---------------------------------------------
***/ 

let catcherLocation;
let catcherRadius;
let cursorImg;
let lives = 4;
let drops = [];
let walkers = [];
let shapes = [];
let repairs = [];
let score;
let gameStart = false;
let impossible = false;
let asteroidsNum = 14;


function preload() {
  // preload() runs once
  gif = loadImage('background.gif');
  img = loadImage('GameOver.png');
  img2 = loadImage('startScreen.png');
}

function setup() {
  createCanvas(500, 500);
  gif.loadPixels();
  
  
  catcherLocation = {'x': 0, 'y': 0};
  catcherRadius = 100;
  imageMode(CENTER);
  cursorImg = loadImage('ufo.png');
  
  for (let i = 0; i < asteroidsNum; i++) {
    let drop = {'x': random(width), 'y': -20, 'r': random(8), 'speed': random(1, 5), 'c':color(255), 'size': random(20)+20, 'nop': floor(random(4))};
    drops.push(drop);
  }

  score = 0;
  
  noCursor(); // Hides cursor for ufo
  
  for (let i = 0; i < 3; i++) {
    let walker = {'x': random(width), 'y': random(height), 'px': 0, 'py': 1000, 'size': 10};
    walkers.push(walker);
  }
  
  for (let i = 0; i < 1; i++) {
    let repair = {'x': width / 2, 'y': height / 2, 'xSpeed': 1, 'ySpeed': 1};
    repairs.push(repair);
  }
  
  
  
}

function draw() {
  background(220);
  image(gif, width/2, height/2);
  if (gameStart == false){
      background(255);
    StartMenu();
      }
  
  
  
  else if (lives > 0 && gameStart == true){

  setCatcherLocation(mouseX, mouseY);
  displayUFOCatcher();
  healthBar();
  
  for (let i = 0; i < drops.length; i++) {
    moveDrop(drops[i]);
    displayDrop(drops[i]);
    
    if(catcherIntersect(drops[i])) {
      caught(drops[i]);
      lives--;
    }

  }  
  
  // display the number of raindrops caught as text
  textSize(14);
  fill(255,0,0);
  stroke(255,0,0)
  strokeWeight(1);
  text('SCORE: ' + score, 20, 30);
    

  if (impossible == true){
      step(walkers[0]);
      displayWalker(walkers[0]); 
      } else{
        for (let i = 0; i < walkers.length; i++) {
      step(walkers[i]);
      displayWalker(walkers[i]); 
  }  }
    

    if (impossible == false){
      for (let i = 0; i < repairs.length; i++) {
        moveRepair(repairs[i]);
        displayrepair(repairs[i]); 
        catcherIntersect3(repairs[i]);
    }  
    }
  } 
  
  
  
  
  else if (lives <=0) { // when game ends
    gameOver();
  }
}

// displays game over screen and stats
function StartMenu(){
  background(0);
    image(img2, width/2, height/2);
  if (key == 'K' || key == 'k') {
    
    impossible = true;    
    print('HARDCORE MODE ACTIVE: NO REPAIR MODE');
    asteroidsNum = 10;
    if (drops.length < 20){
    for (let i = 0; i < asteroidsNum; i++) {
    let drop = {'x': random(width), 'y': -20, 'r': random(8), 'speed': random(1, 5), 'c':color(255), 'size': random(20)+20, 'nop': floor(random(4))};
    drops.push(drop);
    }
  }
  }
    if (key == ' ') {
    
    gameStart = true;

  }
}

// displays game over screen and stats
function gameOver(){
  background(0);
    image(img, width/2, height/2);
    textSize(50);
    fill(255, 0, 0);
    stroke(255, 0, 0);
    strokeWeight(2);
    textAlign(CENTER);
    text('SCORE: ' + score, width/2, 375);
}

/*** functions for raindrops ***/
// move the raindrop down
function moveDrop(drop) {
  drop.y += drop.speed;
  
  if(drop.y > height + drop.r) {
    drop.y = -100; // puts it back to top
    drop.x = random(width);
    drop.size = random(20)+20;
    drop.speed = random(1, 5);
    drop.r = random(8);
    drop.nop = floor(random(4));
  }
}

// display the Asteroid
function displayDrop(drop) {
  fill(drop.c);
  noStroke();
  push();
  translate(drop.x, drop.y);
  rotate(PI/drop.r);
  r=drop.size/2;
  stroke(0);
  fill(139,69,19);
  strokeWeight(4);
  switch (drop.nop){
    case 0:
      beginShape();
      vertex(0, -r)
      quadraticVertex(r, -r, r+4, 0);
      quadraticVertex(r, r, 0, r);
      quadraticVertex(-r, r-2, -r, 0);
      quadraticVertex(-r, r, -r, 0);
      quadraticVertex(-r, -r, 0, -r);
      endShape();
    break;
    case 1:
      beginShape();
      vertex(0, -r)
      quadraticVertex(r, r-3, 0, r);
      quadraticVertex(-r, r-2, -r, 0);
      quadraticVertex(-r, r-1, -r, 0);
      quadraticVertex(-r, -r, 0, -r);
      endShape();
      break;
    case 2:
      circle(0,0,r*2);
      break;
    case 3:
      square(0,0,r*2);
      break;
  }
  pop();
}

/*** functions for the catcher ***/
// set the catcher's location
function setCatcherLocation(x, y) {
  catcherLocation.x = x;
  catcherLocation.y = y;
}

// display a simple ellipse catcher
function displayUFOCatcher() {
  image(cursorImg, mouseX, mouseY, 100, 50);
}

function healthBar(){
  noFill();
  stroke(225);
  rect(280, 20, 200, 25);
  fill(0,200,100);
  rect(280, 20, 50*lives, 25);
}

// a function that returns true or false based on
// if the catcher intersects a raindrop 
function catcherIntersect(drop) {
  // cacluate distance between the catcher and the raindrop
  let dx = catcherLocation.x - drop.x;
  let dy = catcherLocation.y - drop.y;
  let distance = sqrt(dx * dx + dy * dy);
  
  // compare distance to sum of radii
  if(distance < (catcherRadius/2 + drop.r)) {
    return true;
  } else {
    return false;
  }
}

// if the drop is caught
function caught(drop) {
  // stop it from moving by setting speed equal to zero
  //drop.speed = 0;
  
  // set the location to somewhere way off-screen
  drop.y = -100;
}

function step(walker) {
  // x- and y-position mapped from noise
  let noiseX = noise(walker.px);
  let noiseY = noise(walker.py);
  walker.x = map(noiseX, 0, 1, 0, width);
  walker.y = map(noiseY, 0, 1, 0, height);
  
  if(catcherIntersect2(walker)) {
    score++;
    walker.px = random(width);
    walker.py = random(height);
    walker.size = 0;
    }
  else{
    walker.size = 10;
  }
  
  // increment the offset values to move through over time
  walker.px += 0.01; 
  walker.py += 0.01;
}

function catcherIntersect2(walker) {
  // cacluate distance between the catcher and the raindrop
  let dx1 = catcherLocation.x - walker.x;
  let dy1 = catcherLocation.y - walker.y;
  let distance1 = sqrt(dx1 * dx1 + dy1 * dy1);
  
  // compare distance to sum of radii
  if(distance1 < (catcherRadius/2 + walker.size)) {
    return true;
    
  } else {
    return false;
  }
}




function displayWalker(walker) {
  strokeWeight(2);
  fill(255, 255, 0);
  stroke(0);
  //circle(walker.x, walker.y, walker.size);
  
    push();
  translate(walker.x, walker.y);
  rotate(frameCount / -100.0);
  star(0, 0, walker.size, walker.size/2, 5);
  pop();
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}


function moveRepair(repair){
    repair.x += repair.xSpeed;
    repair.y += repair.ySpeed;
  
    if(repair.x > width || repair.x < 0) {
    repair.xSpeed = repair.xSpeed * -1;
  }
  
  if(repair.y > height || repair.y < 0) {
    repair.ySpeed = repair.ySpeed * -1;
  } 
}

function displayrepair(w) {
  strokeWeight(10);
  stroke(0,0,255);
  point(w.x, w.y);
}

function catcherIntersect3(repair) {
  // cacluate distance between the catcher and the raindrop
  let dx = catcherLocation.x - repair.x;
  let dy = catcherLocation.y - repair.y;
  let distance = sqrt(dx * dx + dy * dy);
  
  // compare distance to sum of radii
  if(distance < (catcherRadius/2 + 5)) {
    repair.x = random(width);
    repair.y = random(height);
    if (lives < 4){
      lives++;
    }
    return true;
  } else {
    return false;
  }
}












