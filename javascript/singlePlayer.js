//****************************************************************************************************************/
/***********  Utility functions **********************************************************************************/
//***************************************************************************************************************/
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
function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}
/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocityX, velocityY, angle) {
  const rotatedVelocities = {
    x: velocityX * Math.cos(angle) - velocityY * Math.sin(angle),
    y: velocityX * Math.sin(angle) + velocityY * Math.cos(angle)
  };

  return rotatedVelocities;
}
//****************************************************************************************************************/
/***********  Initial Setup ********************************************************************************************/
//***************************************************************************************************************/
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
//****************************************************************************************************************/
/***********  Variable ********************************************************************************************/
//***************************************************************************************************************/
var winScore = 5;//goals needed to win
var ball;
var player1; var player2; //initialising players
var player1Controller; var player2Controller;
var controller; var controller2;
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};
var ballGravity = 1; //ball gravity
var frictionY = 0.9; //ball friction
var frictionX = 0.99; //ball
var playerGravity = 1.5;
var playerFrictionX = 0.95;
var playerFrictionY = 0.9;
var squareWidth = 35;//player size
var playerRadius = 25;
var ballRadius = 35;
var jumpDistance = 35;//jump height of players
//****************************************************************************************************************/
/***********  Objects ********************************************************************************************/
//***************************************************************************************************************/
//this is ball
function Ball(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx
  this.dy = dy;
  this.radius = radius;
  this.color = randomColor();
  this.mass = 1;
  this.gravity = ballGravity;
  this.update = function () {
    if (this.y + this.radius + this.dy > canvas.height) {
      this.dy = -(this.dy * 0.9);
      this.dy = this.dy * frictionY;
      this.dx = this.dx * frictionY;
    } else {
      this.dy += this.gravity;
    }
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx * frictionX;
    }
    if (this.y + this.radius + 30 < 0) {
      this.dy = -this.dy;
    }
    // if (distance(0, 0, this.x, this.y) > canvas.width || canvas.height) {
    //   this.y = 0;
    // } //statement to make ball reposistion when out of bounds
    this.x += (this.dx);
    this.y += this.dy;
    //when ball hit player 1
    if (distance(this.x + this.dx, this.y + this.dy, player1.x + player1.dx, player1.y + player1.dy) < this.radius + playerRadius) {
      if (player1.x - this.x > - playerRadius - this.radius && this.x - player1.x < this.radius) {
        this.dx = -this.dx - 7;
        this.dy += 10;
        player1.dx = -player1.dx + 1;
      }
      if (this.x - player1.x > - playerRadius - this.radius && player1.x - this.x < this.radius) {
        this.dx = -this.dx + 7;
        this.dy = this.dy + 10;
        player1.dx = -player1.dx - 1;
      }
      if (player1.y - this.y > playerRadius + this.radius && this.y - player2.y < -playerRadius) {
        this.dy = -this.dy - 2;
      }
      if (this.y - player1.y > playerRadius + this.radius) {
        player1.dy = -player1.dy - 1;
      }
    }
    //when ball hit player 2
    if (distance(this.x + this.dx, this.y + this.dy, player2.x + player2.dx, player2.y + player2.dy) < this.radius + playerRadius) {
      if (this.x - player2.x > - playerRadius - this.radius && player2.x - this.x <= this.radius) {
        this.dx = -this.dx + 7;
        this.dy += 10;
        player2.dx = -player2.dx - 1;
      }
      if (player2.x - this.x > - playerRadius - this.radius && this.x - player2.x < this.radius) {
        this.dx = -this.dx - 7;
        this.dy += 10;
        player2.dx = -player2.dx + 1;
      }
      if (this.y - player2.y > playerRadius + this.radius && this.y - player2.y > -playerRadius) {
        player2.dy = -player2.dy - 1;
      }
      if (player2.y - this.y > playerRadius + this.radius && player2.y - this.y > -playerRadius) {
        this.dy = -this.dy - 4;
      }
    }
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
//creating the goalposts
function renderGates(color1, color2) {
  c.save();
  c.beginPath();
  c.moveTo(0, canvas.height);
  c.lineTo(0, canvas.height - 200);
  c.strokeStyle = color1;
  c.lineWidth = 30;
  c.stroke();
  c.closePath();
  c.beginPath();
  c.moveTo(canvas.width, canvas.height);
  c.lineTo(canvas.width, canvas.height - 200);
  c.strokeStyle = color2;
  c.lineWidth = 30;
  c.stroke();
  c.closePath();
  c.restore();
}
//creating Players
function Player(x, y, dx, dy, radius, color, jumping, player, score) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;
  this.jumping = jumping;
  this.player = player;
  this.score = score;
  this.mass = 1;
  this.xFriction = playerFrictionX;
  this.yFriction = playerFrictionY;
  this.gravity = playerGravity;
  this.update = function () {
    if (this.player === 1) {//logic for when jumped
      if (controller.up && this.jumping === false) {
        this.dy -= jumpDistance;
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
      if (controller.up2 && this.jumping === false) {
        this.dy -= jumpDistance;
        this.jumping = true;
      }
      if (controller.left2) {
        this.dx -= 0.5;
      }
      if (controller.right2) {
        this.dx += 0.5;
      }
    }
    else if (this.player === 3) {
      //console.log(` ${this.dx}`);
      if (ball.x < this.x) {
        this.dx -= 0.5;
      }
      if (ball.x + ballRadius > this.x && this.jumping === false) {
        this.dx += 0.5;
        if (distance(this.x + this.dx, this.y + this.dy, ball.x + ball.dx, ball.y + ball.dy) < ballRadius * 2 + this.radius * 2) {
          this.dy -= jumpDistance;
          this.jumping = true;
          this.dx += 0.5;
        }
      }
    }

    this.dy += this.gravity;// gravity
    this.x += this.dx;
    this.y += this.dy;
    this.dx *= this.xFriction;// friction
    this.dy *= this.yFriction;// friction
    // if rectangle is falling below floor line
    if (this.y > c.canvas.height - 1 - radius) {
      this.jumping = false;
      this.y = c.canvas.height - 1 - radius;
      this.dy = 0;
    }
    // if rectangle is going off the left of the screen
    if (this.x <= 0) {
      this.x = 5;
    } else if (this.x > c.canvas.width) {// if rectangle goes past right boundary
      this.x = c.canvas.width;
    }
    this.draw();
  };
  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.lineWidth = 2;
    c.fillStyle = this.color;
    c.fill();
    c.stroke();
    c.closePath();
  };
}
// controller containing logic
controller = {
  left: false,
  right: false,
  up: false,
  reset: false,
  startPage: false,
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
      case 68://player2  d key right
        controller.right2 = key_state;
        break;
      case 87://player2  w key up
        controller.up2 = key_state;
        break;
      case 65://player2 a key left
        controller.left2 = key_state;
        break;
      case 82:// press R to restart
        controller.reset = key_state;
        break
      case 49:// press 1 to go to start page
        controller.startPage = key_state;
        break
    }
  }
};
function clearScore() {
  player1.score = 0;
  player2.score = 0;
}
//renders score text, calculate score conditions based on winScore value and restarts when reset triggered
function displayScore() {
  c.beginPath();
  //prints current score
  c.font = "30px Comic Sans MS";
  c.fillStyle = "black";
  c.textAlign = "center";
  c.fillText(`${player1.score} - ${player2.score}`, canvas.width / squareWidth, canvas.height / 16);
  c.closePath();
  //when player1 meets win condition and restarts
  if (player1.score >= winScore || player2.score >= winScore) {
    if (player1.score - player2.score >= 2) {
      c.beginPath();
      c.font = "30px Comic Sans MS";
      c.fillStyle = "black";
      c.textAlign = "center";
      c.fillText(`Player 1 Victory Royale`, canvas.width / 2, canvas.height / 4);
      c.fillText(`Click R to reset`, canvas.width / 2, (canvas.height / 4) + 40);
      c.closePath();
      if (controller.reset === true) {
        clearScore();
        init();
      }
    }
    //when player2 meets win condition and restarts
    else if (player2.score - player1.score >= 2) {
      c.beginPath();
      c.font = "30px Comic Sans MS";
      c.fillStyle = "black";
      c.textAlign = "center";
      c.fillText(`Player 2 Victory Royale`, canvas.width / 2, canvas.height / 4);
      c.fillText(`Click R to reset`, canvas.width / 2, (canvas.height / 4) + 40);
      c.closePath();
      if (controller.reset === true) {
        clearScore();
        init();
      }
    }
    //when player2 gains advantage condition
    else if (player2.score - player1.score >= 1 && player2.score - player1.score < 2) {
      c.beginPath();
      c.font = "30px Comic Sans MS";
      c.fillStyle = "black";
      c.textAlign = "center";
      c.fillText(`Advantage player 2`, canvas.width / 2, canvas.height / 4);
      c.closePath();
    }
    //when player2 gains advantage condition
    else if (player1.score - player2.score >= 1 && player1.score - player2.score < 2) {
      c.beginPath();
      c.font = "30px Comic Sans MS";
      c.fillStyle = "black";
      c.textAlign = "center";
      c.fillText(`Advantage player 1`, canvas.width / 2, canvas.height / 4);
      c.closePath();
    }
  }
}
//After goal is scored play the ball again and reposisition players to start
function softReset() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 3;
  ball.dx = randomIntFromRange(-5, 5);
  ball.dy = randomIntFromRange(-2, 2);
  player1.x = canvas.width / 4;
  player2.x = canvas.width * 3 / 4;
}
function backgroundSong() {
  myGamePiece = new component(30, 30, "red", 10, 120);
  mySound = new sound("");
  myMusic = new sound("");
  myMusic.play();
  myGameArea.start();
}
//****************************************************************************************************************/
/***********  Event Listeners  ***********************************************************************************/
//***************************************************************************************************************/
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
//****************************************************************************************************************/
/***********  Implementation  ***********************************************************************************/
//***************************************************************************************************************/
function init() {
  var player1Score = 0;
  var player2Score = 0;
  player1Controller = 2;
  player2Controller = 3;
  var x = canvas.width / 2;//randomIntFromRange(radius, canvas.width - radius);
  var y = canvas.height / 3; //randomIntFromRange(radius, canvas.height - radius);
  var dx = randomIntFromRange(-3, 3);
  var dy = randomIntFromRange(-2, 2);
  player1 = new Player(canvas.width / 4, canvas.height / 3, 0, 0, playerRadius, 'blue', true, player1Controller, player1Score);
  player2 = new Player(3 * canvas.width / 4, canvas.height / 3, 0, 0, playerRadius, 'red', true, player2Controller, player2Score);
  ball = new Ball(x, y, dx, dy, ballRadius);
}
//****************************************************************************************************************/
/***********  Animation Loop  ***********************************************************************************/
//***************************************************************************************************************/
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  ball.update();
  player1.update();
  player2.update();
  displayScore();
  // player collision: distance checker: console.log(distance(player1.x, player1.y, player2.x, player2.y));
  //console.log(` ${ball.y - player1.y}`);
  if (distance(player1.x, player1.y, player2.x, player2.y) < playerRadius * 2) {
    if (player2.x - player1.x > -playerRadius * 2 && player2.x - player1.x < playerRadius) {
      player1.dx = -player1.dx + 2;
      player2.dx = -player2.dx - 2;
    }
    if (player2.x - player1.x < playerRadius * 2 && player2.x - player1.x >= -playerRadius) {
      player1.dx = -player1.dx - 2;
      player2.dx = -player2.dx + 2;
    }
    if (player1.y - player2.y < playerRadius * 2 && player1.y - player2.y > -playerRadius) {
      player2.dy = -player2.dy - 2;
    }
    if (player2.y - player1.y < playerRadius * 2 && player2.y - player1.y > -playerRadius) {
      player1.dy = -player1.dy - 2;
    }
  }
  renderGates(player1.color, player2.color);  //when ball hits gate and respawn
  if (ball.x + ball.radius >= canvas.width - 1 && ball.y + ball.radius + ball.dy > canvas.height - 200) {
    softReset();
    player1.score++;
    displayScore();
  }   // The ball hitting the left gate
  if (ball.x - ball.radius <= 1 && ball.y + ball.radius + ball.dy > canvas.height - 200) {
    softReset();
    player2.score++;
    displayScore();
  }
}
//****************************************************************************************************************/
/***********  START PROGRAM ***********************************************************************************/
//***************************************************************************************************************/
init();

//testing dat.gui
gui = new dat.GUI();
gui.close();
var f1 = gui.addFolder('Ball');
f1.add(ball, 'radius', 1, 50);
f1.add(ball, 'gravity', 0, 30);
f1.open();
var f2 = gui.addFolder('Player 1');
f2.add(player1, 'radius', 1, 50);
f2.add(player1, 'gravity', 0, 30);
f2.close();
var f3 = gui.addFolder('Player 2');
f3.add(player2, 'radius', 1, 50);
f3.add(player2, 'gravity', 0, 30);
f3.close();


animate();
