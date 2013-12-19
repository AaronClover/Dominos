var canvas = document.getElementById('myCanvas');
var cWidth  = window.innerWidth;
var cHeight = window.innerHeight;

//-------------------------------------------------------------------------------------
// Objects/variables - top layer is last (except drawable area is first)
// this is basically initializing the game
//-------------------------------------------------------------------------------------
var drawableArea = new polygon(4, false);
var touchEvent; //Pointer for most recent touch/mouse event
dominoArray = new Array();   // All dominoes shoould be stored in here
var drawableArea = new pline(4);
var touchableItems = new Array(); //All touchable items must go in here
var activeDomino = -1;  
var dominoIds = 0;

var player1 = new player("Player 1");
var player2 = new player("Player 2");
//prompt("Please enter the name of the first player.","Your name")

// initialize the drawable area


//var testdom = new domino(1,1,50);



var activePlayerPanel = new playerPanel ("active");
drawableArea.dependentDrawableItems.push(activePlayerPanel);

var passivePlayerPanel = new playerPanel ("passive");
drawableArea.dependentDrawableItems.push(passivePlayerPanel);

var theBoneyard = new boneyard();


//deal a hand to player one
for (i = 0; i < 7; i++){
    player1.dependentDrawableItems[i] = theBoneyard.dependentDrawableItems.pop();
    player1.dependentDrawableItems[i].flipOver();
}
//deal a hand to player two
for (i = 0; i < 7; i++){
    player2.dependentDrawableItems[i] = theBoneyard.dependentDrawableItems.pop();
}

var theButtonPanel = new buttonPanel();
drawableArea.dependentDrawableItems.push(theButtonPanel);

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
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(/* function */callback, /* DOMElement */element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


function animate() {
    requestAnimationFrame( animate );
    update();
    drawScreen();

}
//------------------------------------------
// Update
//------------------------------------------
var updateArray = new Array();
function update(){
    if (activeDomino >= 0) {     
        //dominoArray[activeDomino].moveTo(mouseX, mouseY);
        dominoArray[activeDomino].move(touchEvent.clientX, touchEvent.clientY);
        }
};
//------------------------------------------
// Draw
//---------------------------------------------------------------------------------------
function drawScreen() {
    var ctx = canvas.getContext('2d');
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var constrainedSize = ((ctx.canvas.width < ctx.canvas.height) ? ctx.canvas.width : ctx.canvas.height);
    
    drawableArea.setPoints(0, 0,
            ctx.canvas.width, 0,
            ctx.canvas.width, ctx.canvas.height,
            0, ctx.canvas.height);

    //drawableArea.dependentDrawableItems[0].moveTo(ctx.canvas.width/3, ctx.canvas.height/3);
    //drawableArea.dependentDrawableItems[0].changeSize(constrainedSize/10);
        
    //drawableArea.dependentDrawableItems[1].moveTo(ctx.canvas.width/2, ctx.canvas.height/2);
    //drawableArea.dependentDrawableItems[1].changeSize(constrainedSize/10);
    
//<<<<<<< HEAD
    // arrange the player panels
    activePlayerPanel.changeSize(ctx, player1);
    passivePlayerPanel.changeSize(ctx, player2);
    
    // draw the boneyard
    theBoneyard.changeSize(ctx);
// =======
    // dominoArray.forEach(function (domino){domino.changeSize(constrainedSize/10)});
    
    /*draw the active player's status bar on the bottom left*/
    // activeStatusBar.setPoints(0, ctx.canvas.height - ctx.canvas.height * activeStatusBar.heightRatio,
            // ctx.canvas.width * activeStatusBar.widthRatio, ctx.canvas.height - ctx.canvas.height * activeStatusBar.heightRatio,
            // ctx.canvas.width * activeStatusBar.widthRatio, ctx.canvas.height,
            // 0, ctx.canvas.height);
    
    /*draw the passive player's status bar on the top right*/
    // passiveStatusBar.setPoints(ctx.canvas.width - ctx.canvas.width * passiveStatusBar.widthRatio, 0,
            // ctx.canvas.width, 0,
            // ctx.canvas.width, ctx.canvas.height * passiveStatusBar.heightRatio,
            // ctx.canvas.width - ctx.canvas.width * passiveStatusBar.widthRatio, ctx.canvas.height * passiveStatusBar.heightRatio);
// >>>>>>> Dominos can now be dragged and dropped freely with a touchscreen or mouse
    
    // draw the buttons
    theButtonPanel.changeSize(ctx);
    
    drawableArea.draw(ctx);
}

