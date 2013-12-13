var canvas = document.getElementById('myCanvas');

//----------------------------------------------------------------------
// Objects/variables - top layer is last (except drawable area is first)
// this is basically initializing the game
//----------------------------------------------------------------------
var drawableArea = new pline(4);

drawableArea.dependentDrawableItems.push(new domino(5,6,50));
drawableArea.dependentDrawableItems.push(new domino(2,3,50));

var activeStatusBar = new playerStatusBar("Player 1");
drawableArea.dependentDrawableItems.push(activeStatusBar);

var passiveStatusBar = new playerStatusBar("Player 2");
drawableArea.dependentDrawableItems.push(passiveStatusBar);

var theBoneyard = new boneyard(1/3, window.innerWidth, window.innerHeight);
drawableArea.dependentDrawableItems.push(theBoneyard);

//------------------------------------------
// Draw loop
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
    
    drawableArea.dependentDrawableItems[0].moveTo(ctx.canvas.width/3, ctx.canvas.height/3);
    drawableArea.dependentDrawableItems[0].changeSize(constrainedSize/10);
    
    drawableArea.dependentDrawableItems[1].moveTo(ctx.canvas.width/2, ctx.canvas.height/2);
    drawableArea.dependentDrawableItems[1].changeSize(constrainedSize/10);
    
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
    
    //draw the boneyard
    theBoneyard.moveTo(ctx.canvas.width, ctx.canvas.height);
    theBoneyard.changeSize(ctx.canvas.width, ctx.canvas.height);
    
    drawableArea.draw(ctx);
}

window.addEventListener('resize', drawScreen);
