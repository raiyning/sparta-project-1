var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function randomColor() {
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += (Math.random() * 16 | 0).toString(16);
  }
  return color
}
function Ball(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx
  this.dy = dy;
  this.radius = radius;
  this.color = randomColor();
  this.mass = 1;
  this.update = function () {
    if (this.y + this.radius + this.dy > canvas.height) {
      this.dy = -this.dy;
      this.dy = this.dy;
      this.dx = this.dx;
    } else {
      this.dy += gravity;
    }
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius + 30 < 0) {
      this.dy = -this.dy;
    }
    this.x += (this.dx);
    this.y += this.dy;
    this.draw();
  };
  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.lineWidth = 5;
    c.fillStyle = this.color;
    c.fill();
    c.stroke();
    c.closePath();
  };
}
var gravity = 1; //ball gravity
function init() {
  var ballRadius = 40;
  var x = canvas.width / 2;//randomIntFromRange(radius, canvas.width - radius);
  var y = 60; //randomIntFromRange(radius, canvas.height - radius);
  var dx = randomIntFromRange(-3, 3);
  var dy = randomIntFromRange(-2, 2);
  ball = new Ball(x, y, dx, dy, ballRadius);
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  ball.update();
}

init();
animate();