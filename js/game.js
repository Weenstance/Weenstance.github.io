// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var scrSize = Math.min(window.innerWidth, window.innerHeight) - 48;
canvas.width = scrSize;
canvas.height = scrSize;
canvas.setAttribute('style', "position: absolute;  left: 50%;margin-left:" + (-scrSize*0.5-4) + "px; top: 50%;margin-top:" + (-scrSize*0.5-4) + "px; border:4px solid black");
document.body.appendChild(canvas);

var spriteReady = [];
var spriteImg = [];

for (var i = 0; i < 2; i++) {
    spriteImg[i] = new Image();
    spriteImg[i].onload = spriteLoaded(i);
}
function spriteLoaded (index) {
    spriteReady[index] = true;
}
spriteImg[0].src = "images/doorway.png";
spriteImg[1].src = "images/monster1.png";


var monsters = [];

monsters[0] = monster({
    sprite: sprite({
        timePerFrame: 0.133,
        numberOfFrames: 5,
        image: 1,
        xpos: 0,
        ypos: 0,
        scale: 16,
        loop: true
    })
});


function monster (options) {
    
    var that = {};
    that.sprite = options.sprite;
    
    that.render = function () {
        that.sprite.render();
    };
    that.update = function (modifier) {
        that.sprite.update(modifier);
    };
    
    return that;
}

function sprite (options) {
				
    var that = {},
        frameIndex = 0,
        tickCount = 0,
        timePerFrame = options.timePerFrame,
        numberOfFrames = options.numberOfFrames || 1;
        
    that.image = options.image,
    that.xpos = options.xpos,
    that.ypos = options.ypos,
    that.scale = options.scale,
    that.loop = options.loop;
    that.context = canvas.getContext("2d");

    that.render = function () {
        // Draw the animation
        if (spriteReady[that.image]) {
            var s = (scrSize / 512 * 16 / 24);
            that.context.drawImage(
                spriteImg[that.image],
                frameIndex * spriteImg[that.image].width / numberOfFrames,
                0,
                spriteImg[that.image].width / numberOfFrames,
                spriteImg[that.image].height,
                (that.xpos - spriteImg[that.image].width / numberOfFrames * 0.5 * that.scale) * s + scrSize * 0.5 - scrSize / 48,
                (that.ypos - spriteImg[that.image].height * 0.5 * that.scale) * s + scrSize * 0.5 - scrSize / 48,
                spriteImg[that.image].width * that.scale * s / numberOfFrames,
                spriteImg[that.image].height * that.scale * s);
        }
    };
    
    that.update = function (delta) {

        tickCount += delta;
			
        if (tickCount > timePerFrame) {
        
        	tickCount = 0;
        	
            // If the current frame index is in range
            if (frameIndex < numberOfFrames - 1) {	
                // Go to the next frame
                frameIndex += 1;
            } else if (that.loop) {
                frameIndex = 0;
            }
        }
    };

    return that;
}


var room = 0;
var monster;

var options = [];

var choices = [];
choices[0] = choice ({
    text: "Strangle the thing."
});
choices[1] = choice ({
    text: "Kick it."
});
choices[2] = choice ({
    text: "Make a silly face."
});

function choice (options) {
    var that = {};
    that.text = options.text;
    return that;
}

function option (options) {
    var that = {};
    that.choice = options.choice;
    that.outcome = options.outcome;
    return that;
}


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    
    for (var i = 0; i < 3; i++)
        if (isInside(mousePos, button[i]))
            alert('clicked inside rect');
}, false);

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y;
}
function rect(x, y, width, height) {
    var that = {};
    that.x = x;
    that.y = y;
    that.width = width;
    that.height = height;
    return that;
}


function moveToRoom (newRoom) {
    room = newRoom;
    monster = Object.assign({}, monsters[Math.floor(Math.random() * monsters.length)]);
    for (var i = 0; i < 3; i++)
        options[i] = option({
            choice : choices[Math.floor(Math.random() * choices.length)],
            outcome : i
        });
}

// Update game objects
function update (modifier) {
    
    //for (var i = 0; i < monsters.length; i++)
    monster.update(modifier);
}

var button = [];
for (var i = 0; i < 3; i++)
    button[i] = rect(scrSize * 0.05, scrSize * 0.015 + i * scrSize * 0.085, scrSize * 0.9, scrSize * 0.065);


// Draw everything
function render (fps) {
	if (spriteReady[0]) {
		ctx.drawImage(spriteImg[0], 0, 0, scrSize, scrSize);
	}

    //for (var i = 0; i < monsters.length; i++)
    monster.render();

	// Score
	ctx.font = scrSize * 0.055 + "px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	for (var i = 0; i < 3; i++) {
	    ctx.fillStyle = "rgba(256, 0, 0, 0.3)";
	    ctx.fillRect(button[i].x, button[i].y, button[i].width, button[i].height);
	    ctx.fillStyle = "rgb(0, 0, 0)";
	    ctx.fillText(options[i].choice.text, button[i].x + button[i].width * 0.5, button[i].y + button[i].height * 0.5);
	}
	    //ctx.fillText(options[i].choice.text, i * scrSize / 3, 32);
}

// The main game loop
function main () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render(Math.round(1 / (delta / 1000)));

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Disable smoothing
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

// Let's play this game!
var then = Date.now();
moveToRoom(0);
main();
