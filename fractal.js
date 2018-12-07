var screenWidth;
var screenHeight;
var renderHeight;
var renderWidth;

var xMargin = 10; // as percentage of screen
var yMargin = 10; // as percentage of screen
var defaultResolution = 2;
var resolution = defaultResolution;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var MAX_ITER = 200;
var magnification = 400;
var zoomAmount = 10;
var panX = 3;
var panY = 2;
var xPanAmount = .1;
var yPanAmount = .1;

var renderPause = false;
var pauseTimer;
var pauseTime = 1; // in seconds


var update = function() {
	var currentTime = new Date;
	if (pauseTimer < currentTime) {
		renderPause = false;
	}
	render();
}

var checkPause = function() {
	
}

var render = function() {
	if (renderPause) {
		resolution = 10;
	} else {
		resolution = defaultResolution;
	}
	for (var i = 0; i < renderWidth; i++) {
		for (var j = 0; j < renderHeight; j++) {
			belongsToSet = checkPoint(i*resolution/magnification - panX,j*resolution/magnification - panY);
			if (belongsToSet == 0) {
				ctx.fillStyle = '#000';
			} else {
				ctx.fillStyle = 'hsl(0,100%,'+belongsToSet+'%)';
			}	
			ctx.fillRect(i*resolution,j*resolution,resolution,resolution);			
		}
	}
	
	//draw buttons
	ctx.fillStyle = 'rgba(0,255,255,.3)'
	ctx.fillRect(0,0,screenWidth,yMargin);
	ctx.fillRect(0,0,xMargin,screenHeight);
	ctx.fillRect(0,screenHeight - yMargin,screenWidth,yMargin);
	ctx.fillRect(screenWidth - xMargin,0,xMargin,screenHeight);
}

var checkPoint = function(x,y){

	var realValue = x;
	var iValue = y;
	
	for (var z = 0; z < MAX_ITER; z++) {
		var realTemp = realValue * realValue - iValue * iValue + x;
		var iTemp = 2 * realValue * iValue + y;
		realValue = realTemp;
		iValue = iTemp;
		
		if (realValue * iValue > 5) {
			return(z / MAX_ITER * 100);
		}
	}
	
	return 0;
}
var buttonPress = function(e){
	if (!renderPause) {
		renderPause = true;
	}
	
	pauseTimer = new Date();
	pauseTimer.setSeconds(pauseTimer.getSeconds() + pauseTime);
		
	var mouseX = e.pageX;
	var mouseY = e.pageY;
	
	if (mouseX < xMargin) {
		panX-=xPanAmount;
	}
	
	if (mouseX > screenWidth - xMargin) {
		panX+=xPanAmount;
	}
	
	if (mouseY < yMargin) {
		panY-=yPanAmount;
	}
	
	if(mouseY > screenHeight - yMargin) {
		panY+=yPanAmount;
	}
	
	if (mouseX > xMargin && mouseX < screenWidth - xMargin) {
		if (mouseY > yMargin && mouseY < screenHeight - yMargin) {
			magnification+=zoomAmount;
		}
	}
}

// Start the page
var pageReady = false; // Page is not ready
var makeReady = function() { pageReady = true }; //Flag the page as ready when this function is run
window.onload = makeReady(); //Run the makeReady function when the page loads

// Once the page is ready then set the time, reset anything that might need to be reset and start the main function
if (pageReady) {
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
	xMargin = Math.floor(screenWidth / xMargin);
	yMargin = Math.floor(screenHeight / yMargin);
	ctx.canvas.width = screenWidth;
	ctx.canvas.height = screenHeight;
	renderWidth = screenWidth / resolution;
	renderHeight = screenHeight / resolution;
	document.addEventListener('mouseup',buttonPress,false);
	render();
	setInterval(function(){update();},1);
};
