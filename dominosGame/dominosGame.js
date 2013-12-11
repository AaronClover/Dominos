var canvas = document.getElementById('myCanvas');

//----------------------------------------------------------------------
// Objects/variables - top layer is last (except drawable area is first)
//----------------------------------------------------------------------
var drawableArea = new pline(4);

var testDomino = new domino(5,6,50);
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = testDomino;


//------------------------------------------
// Draw loop
//------------------------------------------
function drawScreen() {
    var context = canvas.getContext('2d');
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;
    var constrainedSize = ((context.canvas.width < context.canvas.height) ? context.canvas.width : context.canvas.height);
    
    drawableArea.setPoints(0,0,
            context.canvas.width,0,
            context.canvas.width,context.canvas.height,
            0,context.canvas.height);
    
    testDomino.moveTo(context.canvas.width/3, context.canvas.height/3);
    testDomino.changeSize(constrainedSize/5);
    testDomino.flipOver();
    testDomino.flipOver();
    
    
    
    drawableArea.draw(context);
}

window.addEventListener('resize', drawScreen);
