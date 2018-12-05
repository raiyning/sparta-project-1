// Utility Functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}


// Initial Setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;


// Variables
var controller;
var controller2;
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};
var colors = [
  '#2185C5',
  '#7ECEFD',
  '#FFF6E5',
  '#FF7F66'
];
var gravity = 1;
var frictionY = 0.9;
var frictionX = 0.99;


// Objects
function Ball(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dx = dx
  this.dy = dy;
  this.radius = radius;
  this.color = color;

  this.update = function () {
    if (this.y + this.radius + this.dy > canvas.height) {
      this.dy = -this.dy;
      this.dy = this.dy * frictionY;
      this.dx = this.dx * frictionY;
    } else {
      this.dy += gravity;
    }

    if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
      this.dx = -this.dx * frictionX;
    }
    this.x += (this.dx);
    this.y += this.dy;
    this.draw();
  };

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.stroke();
    c.closePath();
  };
}
function renderGates() {
  c.save();
  c.beginPath();
  c.moveTo(0, canvas.height);
  c.lineTo(0, canvas.height - 200);
  c.strokeStyle = "black";
  c.lineWidth = 30;
  c.stroke();
  c.closePath();
  c.beginPath();
  c.moveTo(canvas.width, canvas.height);
  c.lineTo(canvas.width, canvas.height - 200);
  c.strokeStyle = "blue";
  c.lineWidth = 30;
  c.stroke();
  c.closePath();
  c.restore();
}


function Player(x, y, dx, dy, width, height, color, jumping, player) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.width = width;
  this.height = height;
  this.color = color;
  this.jumping = jumping;
  this.player = player;
  this.update = function () {
    if (this.player === 1) {
      if (controller.up && this.jumping === false) {
        this.dy -= 20;
        this.jumping = true;
      }
      if (controller.left) {
        this.dx -= 0.5;
      }
      if (controller.right) {
        this.dx += 0.5;
      }
    }
    else if (this.player === 2) {
      if (controller2.up2 && this.jumping === false) {
        this.dy -= 20;
        this.jumping = true;
      }
      if (controller2.left2) {
        this.dx -= 0.5;
      }
      if (controller2.right2) {
        this.dx += 0.5;
      }
    }
    this.dy += 1.5;// gravity
    this.x += this.dx;
    this.y += this.dy;
    this.dx *= 0.9;// friction
    this.dy *= 0.9;// friction

    // if rectangle is falling below floor line
    if (this.y > c.canvas.height - 16 - 32) {
      this.jumping = false;
      this.y = c.canvas.height - 16 - 32;
      this.dy = 0;
    }
    // if rectangle is going off the left of the screen
    if (this.x <= 0) {
      this.x = 5;
    } else if (this.x > c.canvas.width) {// if rectangle goes past right boundary
      this.x = c.canvas.width - 10;
    }
    this.draw();
  };
  this.draw = function () {
    c.beginPath();
    c.fillStyle = `${this.color}`;
    c.fillRect(this.x, this.y, this.width, this.height);
    c.fill();
    //c.stroke();
    c.closePath();
  };
}

controller = {
  left1: false,
  right1: false,
  up1: false,
  keyListener: function (event) {
    var key_state = (event.type == "keydown") ? true : false;
    switch (event.keyCode) {
      case 37:// left key
        controller.left = key_state;
        break;
      case 38:// up key
        controller.up = key_state;
        break;
      case 39:// right key
        controller.right = key_state;
        break;
    }
  }
};
controller2 = {
  left2: false,
  right2: false,
  up2: false,
  keyListener: function (event) {
    var key_state2 = (event.type == "keydown") ? true : false;
    switch (event.keyCode) {
      case 68://player2  d key right
        controller2.right2 = key_state2;
        break;
      case 87://player2  w key up
        controller2.up2 = key_state2;
        break;
      case 65://player2 a key left
        controller2.left2 = key_state2;
        break;
    }
  }
}
// Event Listeners
addEventListener("mousemove", function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

// Implementation
var ball; var player1; var player2; var leftGate
function init() {
  var radius = 30;
  var x = randomIntFromRange(radius, canvas.width - radius);
  var y = canvas.height / 2;
  var dx = randomIntFromRange(-3, 3);
  var dy = randomIntFromRange(-2, 2);

  player1 = new Player(canvas.width / 4, canvas.height / 3, 0, 0, 32, 32, 'blue', true, 1);
  player2 = new Player(3 * canvas.width / 4, canvas.height / 3, 0, 0, 32, 32, 'blue', true, 2);
  ball = new Ball(x, y, dx, dy, 30, 'red');
  console.log(ball);
  console.log(player1);
  console.log(player2);
}
// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  ball.update();
  player1.update();
  player2.update();
  if (distance(ball.x, ball.y, player1.x, player1.y) < ball.radius) {
    if (player1.x > ball.x) {

      ball.dx = (-ball.dx - 10) * 1.1;
    }
    else
      ball.dx = (-ball.dx + 10) * 1.1;
  }
  renderGates();
  if (ball.x + ball.radius >= canvas.width - 1 && ball.y + ball.radius + ball.dy > canvas.height - 200) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 3;
    ball.dx = randomIntFromRange(-10, 10);
    ball.dy = randomIntFromRange(-2, 2);
  }

}
init();
animate();