'use strict';

// prep
var gameDiv = document.querySelector('#game-div');
var gameCanvasElement = document.querySelector('#game-canvas');
var gameCanvas = gameCanvasElement.getContext('2d');
gameCanvasElement.setAttribute('tabindex', '1');
var width = gameCanvasElement.width;
var height = gameCanvasElement.height;

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
  gameCanvas.save();
  gameCanvas.beginPath();
  gameCanvas.fillStyle = this.color;
  var camPos = camera.convert(this.pos);
  gameCanvas.arc(camPos.x, camPos.y, this.size, 0, Math.PI*2, false);
  gameCanvas.closePath();
  gameCanvas.fill();
  gameCanvas.restore();
}

// main
// .clearRect, .strokeRect, fillRect
// beginPath() moveTo()
//closePath() stroke() fill()
// arc(x, y, startAngle, endAngle) arcTo(x1, y1, x2, y2, radius)

//gameCanvas.fillStyle = "rgb(200,0,0)";
//gameCanvas.fillRect(10, 10, 55, 50);

//gameCanvas.fillStyle = "rgba(0, 0, 200, 0.5)";
//gameCanvas.fillRect (30, 30, 55, 50);

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
    gameCanvas.save()
    object.render();
    gameCanvas.restore();
  }

  gameCanvas.save()
  gameCanvas.fillStyle = "black";
  gameCanvas.shadowColor = "red";
  gameCanvas.shadowOffsetX = 3;
  gameCanvas.shadowOffsetY = 3;
  gameCanvas.shadowBlur = 1;
  gameCanvas.font = "48px serif";
  gameCanvas.textBaseline = "middle";
  gameCanvas.fillText("test", width * 0.1, height * 0.9);
  gameCanvas.restore();

  requestAnimationFrame(draw);
})();

//.textAlign(start end left right center)

function clear() {
  gameCanvas.save();
  gameCanvas.fillStyle = "green";
  gameCanvas.fillRect(0, 0, width, height);
  //gameCanvas.fillStyle="red";
  //gameCanvas.strokeRect(0, 0, width, height);
  gameCanvas.restore();
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
gameCanvasElement.addEventListener('keypress', function (event) {
  console.log('keypress', event.keyCode);
  if (keybindings[event.keyCode]) {
    console.log('control');
  } else {
    console.log('no control');
  }
});

gameCanvasElement.addEventListener('click', function (event) {
  event.target.focus();
});

var gameFocus;
gameCanvasElement.addEventListener('focus', function(event) {
  console.log('focus');
  gameFocus = true;
  // lock the pointer
  gameCanvasElement.requestPointerLock = gameCanvasElement.requestPointerLock ||
    gameCanvasElement.mozRequestPointerLock ||
    gameCanvasElement.webkitRequestPointerLock;
  gameCanvasElement.requestPointerLock()
});

gameCanvasElement.addEventListener('blur', function(event) {
  console.log('blur');
  gameFocus = false;
  // release the pointer
  gameCanvasElement.exitPointerLock = gameCanvasElement.exitPointerLock ||
    gameCanvasElement.mozExitPointerLock ||
    gameCanvasElement.webkitExitPointerLock;
  gameCanvasElement.exitPointerLock()
});

gameCanvasElement.addEventListener('mousemove', function (event) {
  //if (document.hasFocus()) {
  if (gameFocus) {
    camera.moveBy({x: event.movementX, y: event.movementY});
  } else {
    //console.log('null mouseover');
  }
});

function isPointerLocked() {
    if(document.pointerLockElement === gameCanvasElement ||
        document.mozPointerLockElement === gameCanvasElement ||
        document.webkitPointerLockElement === gameCanvasElement) {
        return true;
    } else {
        return false;
    }
}

function lockChangeAlert() {
    if (isPointerLocked()) {
        console.log('pointer locked');
    } else {
        console.log('pointer unlocked');
        gameCanvasElement.blur();
    }
}

if ("onpointerlockchange" in document) {
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
} else if ("onmozpointerlockchange" in document) {
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
} else if ("onwebkitpointerlockchange" in document) {
    document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);
}
