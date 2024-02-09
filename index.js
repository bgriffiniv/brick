// index.js

// canvas is created/configured programmatically now
//<!--canvas-->
//<canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;"></canvas>

/* SCREEN */
// size and resolution

/* WINDOW */
// size and presentation
// Set event listener for window resize
window.addEventListener('resize', () => {
  reset();
});
// Set event listener for device orientation change
window.addEventListener('orientationchange', () => {
  reset();
});

/* CANVAS */
// size and options
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const center = {
  x:0,
  y:0
};
const player = {
  x:center.x,
  y:center.y,
  speed:2
};

document.body.appendChild(canvas);
reset();

function resetWindow() {
  console.log("resizing");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  center.x = canvas.width/2;
  center.y = canvas.height/2;
}

/* LIGHTS */
// colors and shadow
const colors = ["red","blue","green","yellow","magenta","cyan"];
//const shadow = "gray";

/* CAMERA */
// assets and effects
// draw a cross at the center to represent the camera
function drawCamera() {
  ctx.beginPath();
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 2;

  [[-8,-8],[8,8],[-8,8],[8,-8]].forEach(fn);
  function fn (v, i, a) {
    let x = v[0], y = v[1];
    //console.log(`(${x},${y})`);
    ctx.moveTo(center.x + x/2,center.y + y/2);
    ctx.lineTo(center.x + x,center.y + y);
  }
  ctx.fill(); // gray fill
  ctx.stroke(); // black border
}

/* ACTION */
// controls and interface

/*
 * Keyboard Controls
 *
 * Tab Q W E R T
 * Caps A S D F G
 * Shift Z X C V
 * E - up
 * D - down
 * S - left
 * F - right
 * W - loose
 * R - tight
 */
//

const KEY_UP = "KeyE";
const KEY_DOWN = "KeyD";
const KEY_LEFT = "KeyS";
const KEY_RIGHT = "KeyF";
const KEY_OUT = "KeyT";
const KEY_IN = "KeyG";
const KEY_RAISE = "KeyQ";
const KEY_LOWER = "KeyA";
const KEY_LOOSE = "KeyW";
const KEY_TIGHT = "KeyR";
const KEY_ACTION = "Space";
const KEY_ESCAPE = "Escape";

//let isUp=false,isDown=false,isLeft=false,isRight=false;
let pressed = [];
let vert=0,hori=0;

window.addEventListener("keydown", (e) =>{
  e.preventDefault();
  var hasKey = pressed.includes(e.code);
  if (!hasKey) pressed.push(e.code);
  /*
  if (e.code===KEY_UP) isUp=true;
  if (e.code===KEY_DOWN) isDown=true;
  if (e.code===KEY_LEFT) isLeft=true;
  if (e.code===KEY_RIGHT) isRight=true;
  */

  if (e.code===KEY_ACTION) reset();
  if (e.code===KEY_ESCAPE) window.location.reload();
});

window.addEventListener("keyup", (e) =>{
  e.preventDefault();
  var index = pressed.indexOf(e.code);
  pressed.splice(index,1);
  /*
  if (e.code===KEY_UP) isUp=false;
  if (e.code===KEY_DOWN) isDown=false;
  if (e.code===KEY_LEFT) isLeft=false;
  if (e.code===KEY_RIGHT) isRight=false;
  */
});

function updateSpeed() {
  vert = updateSpeedComponent(KEY_UP, KEY_DOWN);
  hori = updateSpeedComponent(KEY_LEFT, KEY_RIGHT);
}

function updateSpeedComponent(keyNeg,keyPos) {
  var indexNeg = pressed.indexOf(keyNeg);
  var indexPos = pressed.indexOf(keyPos);
  return Math.sign(indexPos-indexNeg);
}

function updateView() {
  //console.log(pressed);
  //console.log(hori,vert);
  //var cx = (isLeft?-1:0) + (isRight?1:0);
  //var cy = (isUp?-1:0) + (isDown?1:0);
  //console.log(isUp, isDown, isLeft, isRight);
  //console.log(cx, cy);
  
  // find the angle based on vector components
  var angle = null;
  if (!(hori == 0 && vert == 0)) angle = Math.atan2(vert,hori);
  
  // then normalize the speed 
  var speed = player.speed;
  
  // then find the new dx and dy
  var dx = 0,dy = 0;
  if (angle !== null) {
    dx = -Math.cos(angle) * speed;
    dy = -Math.sin(angle) * speed;
  }

  // then change the center position
  center.x += dx;
  center.y += dy;

}

/* WORLD */
// objects and physics
function drawWorld() {
  canvas.style.backgroundColor = "gray";
  ctx.save();
  drawGrid();
  drawCenter();
  drawBorder();
  ctx.restore();
}

function drawGrid() {
  ctx.beginPath()
  ctx.strokeStyle = "lightgray";
  ctx.lineWidth = 2;
  const unit = 100;
  ctx.moveTo(center.x,0);
  ctx.lineTo(center.x,canvas.height);
  ctx.moveTo(0,center.y);
  ctx.lineTo(canvas.width,center.y);
  ctx.rect(0,0,canvas.width,canvas.height);
  for (let x=0;x<canvas.width/unit;x++) {
    for (let y=0;y<canvas.height/unit;y++) {
      let rx = center.x-(x*unit);
      let rw = x*2*unit;
      let ry = center.y-(y*unit);
      let rh = y*2*unit;
      ctx.rect(rx,0,rw,canvas.height);
      ctx.rect(0,ry,canvas.width,rh);
    }
  }
  ctx.stroke();
}

function drawCenter() {
  ctx.beginPath();
  ctx.strokeStyle = "lightgray";
  ctx.fillStyle = "gray";
  ctx.lineWidth = 2;
  let radius = 5;
  ctx.moveTo(center.x+radius,center.y);
  ctx.arc(center.x,center.y,radius,0,2*Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawBorder() {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.rect(0,0,canvas.width,canvas.height);
  ctx.stroke();
}

// draw a dot at the center to represent the player
function drawPlayer() {
  ctx.restore();
  ctx.beginPath();
  ctx.fillStyle = "purple";
  ctx.arc(player.x,player.y,2,0,2*Math.PI);
  ctx.fill();
}
function resetPlayer() {
  player.x = center.x;
  player.y = center.y;
}
/* SCENE */
// menus and rooms


/* FRAME */
function frame() {
  // clear screen
  clear();
  // draw state
  draw();
  // update state
  update();
  //updatePlayer();
  // resolve conflicts
  // await frame
  window.requestAnimationFrame(frame);
}
window.requestAnimationFrame(frame);

function clear() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function reset() {
  resetWindow();
  resetPlayer();
}

function draw() {
  drawWorld();
  drawPlayer();
  drawCamera();
}

function update() {
  updateSpeed();
  updateView();
}

/* DEBUG */
// elapsed time and framerate counters