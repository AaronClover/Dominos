var canvas = document.getElementById('myCanvas');

//----------------------------------------------------------------------
// Objects/variables - top layer is last (except drawable area is first)
//----------------------------------------------------------------------
var drawableArea = new pline(4);

var testDomino = new domino(5,6,50);
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = testDomino;

var activeStatusBar = new playerStatusBar(1/10, 1/3);
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = activeStatusBar;

var passiveStatusBar = new playerStatusBar(1/10, 1/3);
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = passiveStatusBar;

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
    
    testDomino.moveTo(ctx.canvas.width/3, ctx.canvas.height/3);
    testDomino.changeSize(constrainedSize/5);
    
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
    
    drawableArea.draw(ctx);
}

window.addEventListener('resize', drawScreen);
