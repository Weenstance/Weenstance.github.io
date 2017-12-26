// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var scrSize = Math.min(window.innerWidth, window.innerHeight) - 16;
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

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
function reset () {

}

// Update game objects
function update (modifier) {
    
    //for (var i = 0; i < monsters.length; i++)
    monsters[0].update(modifier);
}

// Draw everything
function render (fps) {
	if (spriteReady[0]) {
		ctx.drawImage(spriteImg[0], 0, 0, scrSize, scrSize);
	}

    //for (var i = 0; i < monsters.length; i++)
    monsters[0].render();

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("1. Strangle the thing.", 32, 32);
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
reset();
main();
