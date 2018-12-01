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


// Utility Functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}


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


// Implementation
var ball;
var ballArray = []
var ballNum = 30;
function init() {
  var radius = 30;
  var x = randomIntFromRange(radius, canvas.width - radius);
  var y = canvas.height / 2;
  var dx = randomIntFromRange(-3, 3);
  var dy = randomIntFromRange(-2, 2);

  ball = new Ball(x, y, dx, dy, 30, 'red');
  console.log(ballArray);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  ball.update();
}

init();
animate();