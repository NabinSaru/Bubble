//Canvas Setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, 800, 500);

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
let gameSpeed = 1;
let gameOver = false;

//Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width/2,
  y: canvas.height/2,
  click: false
}
canvas.addEventListener('mousedown', function(event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
})

canvas.addEventListener('mouseup', function() {
  mouse.click = false;
})

//Player
const playerLeft = new Image();
playerLeft.src = 'fish2_swim.png';
const playerRight = new Image();
playerRight.src = 'fish2_swim_right.png';
const bubbleImg = new Image();
bubbleImg.src = 'bubble_pop/bubble_pop_frame_01.png';
class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height/2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
    this.frame = 0;
  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    let theta = Math.atan2(dy,dx);
    this.angle = theta;
    if(mouse.x != this.x) {
      this.x -= dx/20;
    }
    if(mouse.y != this.y) {
      this.y -= dy/20;
    }
    if (gameFrame % 5 == 0) {
      this.frame++;
      if(this.frame >= 12) this.frame = 0;
      //handling the rows of sprite
      if(this.frame === 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }
  }

  draw() {
    if(mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }

    // ctx.fillStyle = 'red';
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.radius, 0, Math.PI*2);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    if(this.x >= mouse.x) {
      ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight, -75, -60, this.spriteWidth/3, this.spriteHeight/3);
    } else {
      ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight, -75, -60, this.spriteWidth/3, this.spriteHeight/3);
    }
    ctx.restore();
  }

}

const player = new Player();

//Bubbles
const bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? 'sound1':'sound2';
  }

  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx*dx + dy*dy);
  }

  draw() {
    // ctx.fillStyle = 'blue';
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.stroke();
    ctx.drawImage(bubbleImg,this.x-65,this.y-65,this.radius * 2.6, this.radius * 2.6)
  }
}

function handleBubble() {
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  }
  for(let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();

    if (bubblesArray[i].y < -bubblesArray[i].radius * 2) {
      bubblesArray.splice(i, 1);
    } else if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
      if (!bubblesArray[i].counted) {
        if (bubblesArray[i].sound == 'sound1') {
          bubbleSound1.play();
        } else {
          bubbleSound2.play();
        }
        score++;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i,1);
      }
      i--;
    }
    //Two Splice method can lead undefined array index so precheck it
  }
}

//Repeating Background
const background = new Image();
background.src = 'surface_water.png';

const BG = {
  x1: 0,
  x2: canvas.width-5,
  y: 0,
  width: canvas.width,
  height: canvas.height
}

function handleBackground() {
  BG.x1 -= gameSpeed;
  BG.x2 -= gameSpeed;
  if(BG.x1 < -BG.width+5) BG.x1 = BG.width-5;
  if(BG.x2 < -BG.width+5) BG.x2 = BG.width-5;
  ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
  ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}

//enemies
const enemy =  new Image();
enemy.src = 'fish.png';

class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.height - 150) + 90;
    this.radius = 60;
    this.speed = Math.random() * 2 + 2;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }

  draw() {
    // ctx.fillStyle = 'white';
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    ctx.drawImage(enemy, this.frameX * this.spriteWidth, this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x-75, this.y-60, this.spriteWidth/3, this.spriteHeight/3);
  }

  update() {
    this.x -= this.speed;
    if(this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }
    if(gameFrame % 5 ==0) {
      this.frame ++;
      if(this.frame >= 12) this.frame = 0;
      //handling the rows of sprite
      if(this.frame === 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }

    //collision with player
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < (this.radius + player.radius)) {
      handleGameOver();
    }
  }
}

function handleGameOver() {
  ctx.fillStyle = 'white';
  ctx.fillText('Game Over, you reached score ' + score, 40, 250);
  gameOver = true;
  backgroundSound.pause();
}

const enemy1 = new Enemy();
function handleEnemy () {
  enemy1.update();
  enemy1.draw();
}
//Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBubble();
  handleBackground();
  handleEnemy();
  player.update();
  player.draw();
  ctx.fillStyle = 'black';
  ctx.fillText('score: ' + score, 10, 50);
  if(!gameOver) requestAnimationFrame(animate);
  gameFrame ++;
}

const bubbleSound1 = new Audio('sound1.ogg');
const bubbleSound2 = new Audio('sound2.wav');
const backgroundSound = new Audio('Cleyton_Underwater.mp3');
backgroundSound.volume = 0.5;
// bubbleSound1.play();
// bubbleSound2.play();
animate();
backgroundSound.play();
window.addEventListener('resize', ()=> {
  canvasPosition = canvas.getBoundingClientRect();
})
