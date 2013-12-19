var canvas = document.getElementById('myCanvas');

//-------------------------------------------------------------------------------------
// Objects/variables - top layer is last (except drawable area is first)
// this is basically initializing the game
//-------------------------------------------------------------------------------------
var player1 = new player("Player 1");
var player2 = new player("Player 2");
//prompt("Please enter the name of the first player.","Your name")

// initialize the drawable area
var drawableArea = new polygon(4, false);

drawableArea.dependentDrawableItems.push(new domino(5,6,50));
drawableArea.dependentDrawableItems.push(new domino(2,3,50));

var activePlayerPanel = new playerPanel ("active");
drawableArea.dependentDrawableItems.push(activePlayerPanel);

var passivePlayerPanel = new playerPanel ("passive");
drawableArea.dependentDrawableItems.push(passivePlayerPanel);

var theBoneyard = new boneyard();
drawableArea.dependentDrawableItems.push(theBoneyard);

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

//---------------------------------------------------------------------------------------
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

    drawableArea.dependentDrawableItems[0].moveTo(ctx.canvas.width/3, ctx.canvas.height/3);
    drawableArea.dependentDrawableItems[0].changeSize(constrainedSize/10);
        
    drawableArea.dependentDrawableItems[1].moveTo(ctx.canvas.width/2, ctx.canvas.height/2);
    drawableArea.dependentDrawableItems[1].changeSize(constrainedSize/10);
    
    // arrange the player panels
    activePlayerPanel.changeSize(ctx, player1);
    passivePlayerPanel.changeSize(ctx, player2);
    
    // draw the boneyard
    theBoneyard.changeSize(ctx);
    
    // draw the buttons
    theButtonPanel.changeSize(ctx);
    
    drawableArea.draw(ctx);
}

window.addEventListener('resize', drawScreen);