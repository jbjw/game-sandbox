'use strict';

// prep
var gameDiv = document.querySelector('#game-div');
var canvasEl = document.querySelector('#game-canvas');
var canvas = canvasEl.getContext('2d');
canvasEl.setAttribute('tabindex', '1');
var width = canvasEl.width;
var height = canvasEl.height;

// camera
var camera = {
	center: {x: 0, y: 0},
	size: {x: width, y: height},
	moveTo: function(pos) {
		this.center.x = pos.x;
		this.center.y = pos.y;
	},
	moveBy: function(offset) {
		this.center.x += offset.x;
		this.center.y += offset.y;
	},
	convert: function(pos) {
		var converted = {x: -this.center.x + pos.x + this.size.x/2,
			y: -this.center.y + pos.y + this.size.y/2};
		return converted;
	},
};

// objects
function Unit(pos) {
	this.pos = pos;
	this.size = 10;
	this.color = 'rgb(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ')';
}

Unit.prototype.render = function() {
	canvas.save();
	canvas.beginPath();
	canvas.fillStyle = this.color;
	var camPos = camera.convert(this.pos);
	canvas.arc(camPos.x, camPos.y, this.size, 0, Math.PI*2, false);
	canvas.closePath();
	canvas.fill();
	canvas.restore();
}

// main
// .clearRect, .strokeRect, fillRect
// beginPath() moveTo()
//closePath() stroke() fill()
// arc(x, y, startAngle, endAngle) arcTo(x1, y1, x2, y2, radius)

//canvas.fillStyle = "rgb(200,0,0)";
//canvas.fillRect(10, 10, 55, 50);

//canvas.fillStyle = "rgba(0, 0, 200, 0.5)";
//canvas.fillRect (30, 30, 55, 50);

var max = 2;
var min = -2;

var objects = [];
for (var i = 0; i < 20; i++) {
	for (var j = 0; j < 400; j++) {
		var myUnit = new Unit({x: j*40 + Math.random()*(max-min) + min,
			y: i*30 + Math.random()*(max-min) + min});

		//var myUnit = new Unit({x: j*40, y: i*30 +min});
		objects.push(myUnit);
	}
}

// basic canvas
(function draw() {
	clear();
	for (var object of objects) { // let?
		canvas.save()
		object.render();
		canvas.restore();
	}

	canvas.save()
	canvas.fillStyle = "black";
	canvas.shadowColor = "red";
	canvas.shadowOffsetX = 3;
	canvas.shadowOffsetY = 3;
	canvas.shadowBlur = 1;
	canvas.font = "48px serif";
	canvas.textBaseline = "middle";
	canvas.fillText("test", width * 0.1, height * 0.9);
	canvas.restore();

	requestAnimationFrame(draw);
})();

//.textAlign(start end left right center)

function clear() {
	canvas.save();
	canvas.fillStyle = "green";
	canvas.fillRect(0, 0, width, height);
	//canvas.fillStyle="red";
	//canvas.strokeRect(0, 0, width, height);
	canvas.restore();
}

// key stuff
// wasd 119 97 115 100
// a list of actions and the associated key
var controlKeys = {
	cameraUp: 119,
	cameraLeft: 97,
	cameraDown: 115,
	cameraRight: 100,
}

// reverse of controlKeys, keyCode is key, behavior is value
var keybindings = {}
for (var key in controlKeys) { // let?
	keybindings[controlKeys[key]] = key;
}

// events
canvasEl.addEventListener('keypress', function (event) {
	console.log('keypress', event.keyCode);
	if (keybindings[event.keyCode]) {
		console.log('control');
	} else {
		console.log('no control');
	}
});

canvasEl.addEventListener('click', function (event) {
	event.target.focus();
});

var focus;
canvasEl.addEventListener('focus', function(event) {
	console.log('focus');
	focus = true;
	// lock the pointer
	canvasEl.requestPointerLock =
		canvasEl.requestPointerLock ||
		canvasEl.mozRequestPointerLock ||
		canvasEl.webkitRequestPointerLock;
	canvasEl.requestPointerLock()
});

canvasEl.addEventListener( 'blur', function( event ) {
	console.log( 'blur' )
	focus = false
	// release the pointer
	// canvasEl.exitPointerLock =
	// 	canvasEl.exitPointerLock ||
	// 	canvasEl.mozExitPointerLock ||
	// 	canvasEl.webkitExitPointerLock
	// canvasEl.exitPointerLock()
} )

canvasEl.addEventListener('mousemove', function (event) {
	//if (document.hasFocus()) {
	if ( focus ) {
		camera.moveBy({x: event.movementX, y: event.movementY});
	} else {
		//console.log('null mouseover');
	}
})


(function onResize() {
	canvasEl.width = window.innerWidth
	canvasEl.height = window.innerHeight
	console.log( 'resize' )
}())

window.addEventListener( 'resize', onResize, false )

function pointerLockChange( e ) {
	if ( document.pointerLockElement === canvasEl ) {
		console.log('pointer locked');
		canvasEl.focus();

	} else {
		console.log('pointer unlocked');
		canvasEl.blur();
	}
}

document.addEventListener('pointerlockchange', pointerLockChange, false);
