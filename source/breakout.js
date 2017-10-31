"use strict";

// breakout

var keyboardState = {}

document.addEventListener("keydown", function (e) {
	keyboardState[e.key] = true
})

document.addEventListener("keyup", function (e) {
	keyboardState[e.key] = false
	// console.log(keyboardState)
})

var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

function rect(x, y, width, height, stroke = false) {
	ctx.beginPath();

	// 10, 10, 20, 20
	// 0, 0, 20, 20
	ctx.rect(x-width/2, y-height/2, width, height);
	if ( stroke ) {
		ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
		ctx.stroke();
	} else {
		ctx.fillStyle = "#FF0000";
		ctx.fill();
	}
	ctx.closePath();
}


function circle() {
	ctx.beginPath();
	ctx.arc(10, 10, 10, 0, Math.PI*2, false);
	ctx.fillStyle = "green";
	ctx.fill();
	ctx.closePath();
}

function Paddle(x, y, w, h) {
	this.x = x
	this.y = y
	this.width = w
	this.height = h

	this.dx = 5
	this.dy = 5

	this.update = function () {
		if (keyboardState["a"]) {
			this.x += -this.dx
		} else if (keyboardState["d"]) {
			this.x += this.dx
		}
	}
	this.render = function () {
		rect(this.x, this.y, this.width, this.height)
	}
}

function Brick(x, y, w, h) {
	this.x = x
	this.y = y
	this.width = w
	this.height = h

	this.update = function () {

	}
	this.render = function () {
		rect(this.x, this.y, this.width, this.height)
	}
}

function Ball(x, y, radius, dx, dy) {
	this.x = x
	this.y = y
	this.radius = radius
	this.dx = dx
	this.dy = dy

	this.update = function () {
		this.x += this.dx;
		this.y += this.dy;

		if ( this.x - this.radius < leftBound ) {
			this.dx = -this.dx
		} else if ( this.x + this.radius > rightBound ) {
			this.dx = -this.dx
		} else if ( this.y - this.radius < topBound ) {
			this.dy = -this.dy
		} else if ( this.y + this.radius > bottomBound ) {
			this.dy = -this.dy
		}
	}
	this.render = function () {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}
}

var leftBound = 0
var rightBound = canvas.width
var topBound = 0
var bottomBound = canvas.height

var centerX = canvas.width/2
var centerY = canvas.height/2

var ball = new Ball(canvas.width/2, canvas.height-30, 10, 2, -2)
var paddle = new Paddle(canvas.width/2, canvas.height*0.8, 100, 20)

var objects = []

function generateBricks() {
	var rows = 6
	var cols = 10

	var xMargin = 30
	var yMargin = 20

	var width = canvas.width

	var xSpan = canvas.width - xMargin*2
	var ySpan = canvas.height/2 - yMargin*2

	var xSpacing = xSpan/(cols-1)
	var ySpacing = ySpan/(rows-1)

	var xStart = xMargin
	var yStart = yMargin

	for ( let row = 0; row < rows; row++ ) {
		for ( let col = 0; col < cols; col++ ) {
			var brick = new Brick(xStart + col*xSpacing, yStart + row*ySpacing, 40, 20, "color")
			objects.push(brick)
		}
	}

	// var rows = 3
	// var cols = 10
	//
	// var xStart = 0
	// var yStart = 20
	//
	// var xSpacing = 100
	// var ySpacing = 50



	// for ( let row = 0; row < rows; row++ ) {
	// 	for ( let col = 0; col < cols; col++ ) {
	// 		var brick = new Brick(xStart + col*xSpacing, yStart + row*ySpacing, 80, 40, "color")
	// 		objects.push(brick)
	// 	}
	// }
}

generateBricks()

objects.push(ball)
objects.push(paddle)

function update() {
	if (ball.y + ball.radius > paddle.y + paddle.height) {
		ball.dy = -ball.dy
	}
	if (ball.y - ball.radius < paddle.y - paddle.height) {
		ball.dy = -ball.dy
	}
	if (ball.x + ball.radius > paddle.x - paddle.width) {
		ball.dx = -ball.dx
	}
	if (ball.x - ball.radius < paddle.x + paddle.width) {
		ball.dx = -ball.dx
	}

	paddle.height

	for ( let object of objects ) {
		object.update()
	}
}

setInterval(update, 10)

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	for ( let object of objects ) {
		object.render()
	}
	window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)
