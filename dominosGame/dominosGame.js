var canvas = document.getElementById('myCanvas');
var cWidth  = window.innerWidth;
var cHeight = window.innerHeight;

var touchEvent;
//----------------------------------------------------------------------
// Objects/variables - top layer is last (except drawable area is first)
//----------------------------------------------------------------------
dominoArray = new Array();   // All dominoes shoould be stored in here
var drawableArea = new pline(4);
var touchableItems = new Array(); //All touchable items must go in here
var activeDomino = -1;  
var dominoIds = 0;

var testdom = new domino(5,6,50, dominoIds++);
//dominoArray.push(testdom);
testdom.moveTo(cWidth/2, cHeight/2);

var testdom2 = new domino(5,6,50, dominoIds++);
testdom2.moveTo(cWidth/2, cHeight/2);

var activeStatusBar = new playerStatusBar(1/10, 1/3);
drawableArea.dependentDrawableItems.push(activeStatusBar);

var passiveStatusBar = new playerStatusBar(1/10, 1/3);
drawableArea.dependentDrawableItems.push(passiveStatusBar);

var boneYard = new boneyard(1/2, window.innerWidth, window.innerHeight);
drawableArea.dependentDrawableItems.push(boneYard);


var touchable = 'createTouch' in document;

var watchTouch = false;

if(touchable) {
	canvas.addEventListener( 'touchstart', onTouchStart, false );
	canvas.addEventListener( 'touchmove', onTouchMove, false );
	canvas.addEventListener( 'touchend', onTouchEnd, false );
}
canvas.addEventListener('mousedown', onClickStart, false);
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('mouseup', onClickEnd, false);
/*************************************
 * Animation loop
 *
 *
 * requestAnim shim layer by Paul Irish Finds the first API that works to
 * optimize the animation loop, otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(/* function */callback, /* DOMElement */element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


function animate() {
    requestAnimFrame( animate );
    update();
    drawScreen();

}
//------------------------------------------
// Update
//------------------------------------------
var updateArray = new Array();
function update(){
    if (activeDomino >= 0) {
        //console.log(mouseX);
        //dominoArray[activeDomino].moveTo(mouseX, mouseY);
        dominoArray[activeDomino].moveTo(touchEvent.clientX, touchEvent.clientY);
        }
};
//------------------------------------------
// Draw
//------------------------------------------
function drawScreen() {
    var ctx = canvas.getContext('2d');
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var constrainedSize = ((ctx.canvas.width < ctx.canvas.height) ? ctx.canvas.width : ctx.canvas.height);
    
    drawableArea.setPoints(0, 0,
            ctx.canvas.width, 0,
            ctx.canvas.width, ctx.canvas.height,
            0, ctx.canvas.height);
    
    dominoArray.forEach(function (domino){domino.changeSize(constrainedSize/10)});
   // testDomino.changeSize(constrainedSize/10);
    
    //draw the active player's status bar on the bottom left
    activeStatusBar.setPoints(0, ctx.canvas.height - ctx.canvas.height * activeStatusBar.heightRatio,
            ctx.canvas.width * activeStatusBar.widthRatio, ctx.canvas.height - ctx.canvas.height * activeStatusBar.heightRatio,
            ctx.canvas.width * activeStatusBar.widthRatio, ctx.canvas.height,
            0, ctx.canvas.height);
    
    //draw the passive player's status bar on the top right
    passiveStatusBar.setPoints(ctx.canvas.width - ctx.canvas.width * passiveStatusBar.widthRatio, 0,
            ctx.canvas.width, 0,
            ctx.canvas.width, ctx.canvas.height * passiveStatusBar.heightRatio,
            ctx.canvas.width - ctx.canvas.width * passiveStatusBar.widthRatio, ctx.canvas.height * passiveStatusBar.heightRatio);
    
    boneYard.changeSize(ctx.canvas.width, ctx.canvas.height);
    
    drawableArea.draw(ctx);
}

//window.addEventListener('resize', drawScreen());
