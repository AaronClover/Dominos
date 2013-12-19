//-------------------------------------------------------------------------------------
// Classes
//-------------------------------------------------------------------------------------
//=====================================================================================
//CLASS - point
function point(x,y){
    this.x = x;
    this.y = y;
}
//=====================================================================================
// CLASS - drawableItem
function drawableItem() {
    this.size =  1;
    this.center = new point(0,0);
    this.strokeStyle = "#ff0000";
    this.lineWidth = 1;
    this.dependentDrawableItems = new Array();
    this.x;
    this.y;
    
    this.move = function(pX, pY) {
        this.x = pX;
        this.y = pY;
        }
}

//=====================================================================================
// CLASS - touchableItem
function touchable(pVerticies) {
    this.enabled = true;
    this.vertices = pVerticies;
    this.touchAction; // Function
    
    this.enable = function(){
        this.enabled = true;
        };
        
    this.disable = function(){
        this.enabled = false;
        };
    }

// changes the size of this item and the relative size of all dependents
drawableItem.prototype.changeSize = function(newSize){
    var relativeItemSizes = new Array();
    relativeItemSizes.length = this.dependentDrawableItems.length;
    // get the relative size of all dependent items
    for (var i = 0; i < this.dependentDrawableItems.length; i++){
        relativeItemSizes[i] = this.dependentDrawableItems[i].size / this.size;
    }
    // change the size
    this.size = newSize;
    // apply the ratio of change back to all dependent items
    for (var i = 0; i < relativeItemSizes.length; i++){
        this.dependentDrawableItems[i].changeSize(relativeItemSizes[i] * newSize);
    }
}
// moves this object and every dependent item an incremental amount
drawableItem.prototype.move = function(moveX,moveY){
    this.center.x += moveX;
    this.center.y += moveY;
    for (var i = 0; i < this.dependentDrawableItems.length; i++) {
        this.dependentDrawableItems[i].move(moveX,moveY);
    }
}
//moves all the vertices and every dependent to an absolute point based on center
drawableItem.prototype.moveTo = function(moveX,moveY){
    //record relative coordinates
    var relativeItems = new Array;
    for (var i = 0; i < this.dependentDrawableItems.length; i++){
        relativeItems[i] = new point;
        relativeItems[i].x = this.dependentDrawableItems[i].center.x - this.center.x;
        relativeItems[i].y = this.dependentDrawableItems[i].center.y - this.center.y;
    }
    //move the center
    this.center.x = moveX;
    this.center.y = moveY;
    //move all the items relative to the center
    for (var i = 0; i < relativeItems.length; i++){
        this.dependentDrawableItems[i].moveTo(this.center.x + relativeItems[i].x,
            this.center.y + relativeItems[i].y);
    }
}
// draws every object in dependentDrawableItems
drawableItem.prototype.draw = function(ctx){
    for (var i = 0; i < this.dependentDrawableItems.length; i++) {
        this.dependentDrawableItems[i].draw(ctx);
    }
}
//=====================================================================================
//CLASS - pline (polyline)
function pline(numberOfVertices){
    drawableItem.call(this);
    this.lineWidth;
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;
    this.width;
    this.height;
    this.alpha = 1;
    this.lineCap = "round";
    this.vertices = new Array();
    for (var i = 0; i < numberOfVertices; i++){this.vertices[i] = new point(0,0);}
}
pline.prototype = Object.create(drawableItem.prototype);
pline.prototype.constructor = pline;

//changes the size of this object and dependent objects, and moves all vertices
//relative to the center of this object and all dependents relative to the center
pline.prototype.changeSize = function(newSize){
    
    var relativePointDistances = new Array;
    var relativeDependents = new Array;
    //record relative coordinates Distances and dependent size and distances
    relativePointDistances.length = this.vertices.length;
    for (var i = 0; i < relativePointDistances.length; i++){
        relativePointDistances[i] = new point;
        relativePointDistances[i].x = (this.vertices[i].x - this.center.x)/this.size;
        relativePointDistances[i].y = (this.vertices[i].y - this.center.y)/this.size;
    }
    relativeDependents.length = this.dependentDrawableItems.length;
    for (var i = 0; i < relativeDependents.length; i++){
        relativeDependents[i] = new point;
        relativeDependents[i].x = (this.dependentDrawableItems[i].center.x - this.center.x)/this.size;
        relativeDependents[i].y = (this.dependentDrawableItems[i].center.y - this.center.y)/this.size;
    }
    //change the size of this object and dependent objects
    drawableItem.prototype.changeSize.call(this, newSize);
    //move all the points relative to the center
    for (var i = 0; i < relativePointDistances.length; i++){
        this.vertices[i].x = this.center.x + (relativePointDistances[i].x * this.size);
        this.vertices[i].y = this.center.y + (relativePointDistances[i].y * this.size);
    }
    for (var i = 0; i < relativeDependents.length; i++){
        this.dependentDrawableItems[i].moveTo(this.center.x + (relativeDependents[i].x * this.size), this.center.y + (relativeDependents[i].y * this.size));
    }
}
//sets any number of arguments into the vertices 
pline.prototype.setPoints = function() {
    for (var i = 0; i < arguments.length; i++){

        if (!(i % 2)){
            this.vertices[(i/2)].x = arguments[i];
            this.right = ((arguments[i] > this.right)? arguments[i] : this.right);
            this.left = ((arguments[i] < this.left)? arguments[i] : this.left);
        }else{
            this.vertices[((i-1)/2)].y = arguments[i];
            this.bottom = ((arguments[i] > this.bottom)? arguments[i] : this.bottom);
            this.top = ((arguments[i] < this.top)? arguments[i] : this.top);
        }
    }
}
//moves this object, all the vertices, and every dependent item an incremental amount
pline.prototype.move = function(moveX,moveY){
    drawableItem.prototype.move.call(this.moveX,moveY);
    for (var i = 0; i < this.vertices.length; i++){
        this.vertices[i].x = this.vertices[i].x + moveX;
        this.vertices[i].y = this.vertices[i].y + moveY;
    }
}
//moves all the vertices and every dependent to an absolute point based on center
pline.prototype.moveTo = function(moveX,moveY){
    //record relative coordinates
    var relativePoints = new Array;
    relativePoints.length = this.vertices.length;
    for (var i = 0; i < relativePoints.length; i++){
        relativePoints[i] = new point;
        relativePoints[i].x = this.vertices[i].x - this.center.x;
        relativePoints[i].y = this.vertices[i].y - this.center.y;
    }
    //move the center and dependent items
    drawableItem.prototype.moveTo.call(this,moveX,moveY);
    //move all the points and items relative to the center
    for (var i = 0; i < relativePoints.length; i++){
        this.vertices[i].x = this.center.x + relativePoints[i].x;
        this.vertices[i].y = this.center.y + relativePoints[i].y;
    }
}
//draws the vertices and then draws every object in dependentDrawableItems
pline.prototype.draw = function(ctx){
    ctx.beginPath();
    ctx.moveTo(this.vertices[0].x,this.vertices[0].y);
    for (var i = 1; i < this.vertices.length; i++) {
        ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
    }
    this.isFilled = false;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = this.lineCap;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.size;
    ctx.stroke();
    drawableItem.prototype.draw.call(this,ctx);
}
//=====================================================================================
//CLASS - polygon
function polygon(numberOfVertices, isFilledPolygon){
    pline.call(this, numberOfVertices);
    this.isFilled = isFilledPolygon;
    this.fillStyle = "";
}
polygon.prototype = Object.create(pline.prototype);
polygon.prototype.constructor = polygon;

//draws the vertices and then draws every object in dependentDrawableItems
polygon.prototype.draw = function(ctx){
    ctx.beginPath();
    ctx.moveTo(this.vertices[0].x,this.vertices[0].y);
    for (var i = 1; i < this.vertices.length; i++) {
        ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
    }
    ctx.closePath();
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = this.lineCap;
    ctx.strokeStyle = this.strokeStyle;
    ctx.globalAlpha = this.alpha;
    if (this.isFilled === true){
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
    }else {
        ctx.stroke();
    }
    drawableItem.prototype.draw.call(this,ctx);
    
}
//=====================================================================================
//CLASS - circle
function circle(isFilledCircle){
    drawableItem.call(this);
    this.isFilled = isFilledCircle
    this.fillStyle = "";
}
circle.prototype = Object.create(drawableItem.prototype);
circle.prototype.constructor = circle;

circle.prototype.draw = function(ctx){
    ctx.moveTo(this.center.x,this.center.y);
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.size, 0, 2*Math.PI);
    ctx.closePath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    if (this.isFilled === true){
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
    }else {
        ctx.stroke();
    }
    drawableItem.prototype.draw.call(this, ctx);
}
//=====================================================================================
//CLASS - text
function text(textDisplay, isFilledText){
    drawableItem.call(this);
    this.text = textDisplay;
    this.strokeStyle = "rgba(0,0,0,0.75)";
    this.fillStyle = "rgba(0,0,0,0.75)"
    this.isFilled = isFilledText;
    this.size = 25;
    this.font = "Arial";
    this.textAlign = "left";
    this.textBaseline = "middle";
}
text.prototype = Object.create(drawableItem.prototype);
text.prototype.constructor = text;

text.prototype.draw = function(ctx){
    ctx.beginPath();
    ctx.moveTo(this.center.x,this.center.y);
    ctx.closePath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.font = this.size + "px " + this.font;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    if (this.isFilled === true){
        ctx.fillText(this.text,this.center.x,this.center.y);
    }else {
        ctx.strokeText(this.text,this.center.x,this.center.y);
    }
    drawableItem.prototype.draw.call(this,ctx);
}
text.prototype.changeSize = function(newSize){
    drawableItem.prototype.changeSize.call(this, newSize);
}
//=====================================================================================
//CLASS - pip
function pip(size){
    circle.call(this,true);
    this.changeSize(size);
    this.fillStyle = "#FFFFFF";
}
pip.prototype = Object.create(circle.prototype);
pip.prototype.constructor = pip;

//=====================================================================================
//CLASS - pipGroup
function pipGroup(numOfPips, size){
    polygon.call(this, 4, true);
    this.fillStyle = "#000000"
    this.changeSize(size);
    this.pipSpaceRatio = size/3.3;
    this.pipSizeRatio = size/10;
    this.setPoints(this.center.x - size/2, this.center.y - size/2,
        this.center.x + size/2, this.center.y - size/2,
        this.center.x + size/2, this.center.y + size/2,
        this.center.x - size/2, this.center.y + size/2);
    for (var i = 0; i < numOfPips; i++){
        this.dependentDrawableItems[i] = new pip(this.pipSizeRatio);
        this.dependentDrawableItems[i].x = this.center.x;
        this.dependentDrawableItems[i].y = this.center.y;
        this.dependentDrawableItems[i].isFilled = true;
    }
    switch(numOfPips){
    case 0:
        break;
    case 1:
        this.dependentDrawableItems[0].center.x = this.center.x;
        this.dependentDrawableItems[0].center.y = this.center.y;
        break;
    case 2:
        this.dependentDrawableItems[0].center.x = this.center.x - this.pipSpaceRatio;
        this.dependentDrawableItems[0].center.y = this.center.y - this.pipSpaceRatio;
        this.dependentDrawableItems[1].center.x = this.center.x + this.pipSpaceRatio;
        this.dependentDrawableItems[1].center.y = this.center.y + this.pipSpaceRatio;
        break;
    case 3:
        this.dependentDrawableItems[0].center.x = this.center.x - this.pipSpaceRatio;
        this.dependentDrawableItems[0].center.y = this.center.y - this.pipSpaceRatio;
        this.dependentDrawableItems[1].center.x = this.center.x;
        this.dependentDrawableItems[1].center.y = this.center.y;
        this.dependentDrawableItems[2].center.x = this.center.x + this.pipSpaceRatio;
        this.dependentDrawableItems[2].center.y = this.center.y + this.pipSpaceRatio;
        break;
    case 4:
        this.dependentDrawableItems[0].center.x = this.center.x - this.pipSpaceRatio;
        this.dependentDrawableItems[0].center.y = this.center.y - this.pipSpaceRatio;
        this.dependentDrawableItems[1].center.x = this.center.x + this.pipSpaceRatio;
        this.dependentDrawableItems[1].center.y = this.center.y - this.pipSpaceRatio;
        this.dependentDrawableItems[2].center.x = this.center.x + this.pipSpaceRatio;
        this.dependentDrawableItems[2].center.y = this.center.y + this.pipSpaceRatio;
        this.dependentDrawableItems[3].center.x = this.center.x - this.pipSpaceRatio;
        this.dependentDrawableItems[3].center.y = this.center.y + this.pipSpaceRatio;
        break;
    case 5:
        this.dependentDrawableItems[0].center.x = this.center.x - this.pipSpaceRatio;
        this.dependentDrawableItems[0].center.y = this.center.y - this.pipSpaceRatio;
        this.dependentDrawableItems[1].center.x = this.center.x + this.pipSpaceRatio;
        this.dependentDrawableItems[1].center.y = this.center.y - this.pipSpaceRatio;
        this.dependentDrawableItems[2].center.x = this.center.x;
        this.dependentDrawableItems[2].center.y = this.center.y;
        this.dependentDrawableItems[3].center.x = this.center.x + this.pipSpaceRatio;
        this.dependentDrawableItems[3].center.y = this.center.y + this.pipSpaceRatio;
        this.dependentDrawableItems[4].center.x = this.center.x - this.pipSpaceRatio;
        this.dependentDrawableItems[4].center.y = this.center.y + this.pipSpaceRatio;
        break;
    case 6:
        this.dependentDrawableItems[0].center.x = this.center.x - this.pipSpaceRatio;
        this.dependentDrawableItems[0].center.y = this.center.y - this.pipSpaceRatio;
        this.dependentDrawableItems[1].center.x = this.center.x + this.pipSpaceRatio;
        this.dependentDrawableItems[1].center.y = this.center.y - this.pipSpaceRatio;
        this.dependentDrawableItems[2].center.x = this.center.x + this.pipSpaceRatio;
        this.dependentDrawableItems[2].center.y = this.center.y;
        this.dependentDrawableItems[3].center.x = this.center.x - this.pipSpaceRatio;
        this.dependentDrawableItems[3].center.y = this.center.y;
        this.dependentDrawableItems[4].center.x = this.center.x + this.pipSpaceRatio;
        this.dependentDrawableItems[4].center.y = this.center.y + this.pipSpaceRatio;
        this.dependentDrawableItems[5].center.x = this.center.x - this.pipSpaceRatio;
        this.dependentDrawableItems[5].center.y = this.center.y + this.pipSpaceRatio;
        break;
    default:        
    }
}
pipGroup.prototype = Object.create(polygon.prototype);
pipGroup.prototype.constructor = pipGroup;

//=====================================================================================
//CLASS - domino
function domino(side1, side2, size){
    touchable.apply(this); // Inherit touchable properties
    this.index = dominoIds++;
    polygon.call(this, 4, true);
    this.fillStyle = "#000000";
    this.middleLineColor = "#FFFFFF";
    this.middleLineWeightRatio = 1/64;
    this.middleLineSpaceRatio = 7/16;
    this.changeSize(size);
    this.hiddenFace = new Array();
    this.isFaceUp = true;
 
    //make a domino shaped rectangle
    this.setPoints(this.center.x - size/2, this.center.y - size,
            this.center.x + size/2, this.center.y - size,
            this.center.x + size/2, this.center.y + size,
            this.center.x - size/2, this.center.y + size);
    //make two sides and place them appropriately on the domino
    this.dependentDrawableItems.push(new pipGroup(side1, size));
    this.dependentDrawableItems[0].moveTo(this.center.x, this.center.y + size/2);
    this.dependentDrawableItems.push(new pipGroup(side2, size));
    this.dependentDrawableItems[1].moveTo(this.center.x, this.center.y - size/2);
    //make the line across the middle
    this.dependentDrawableItems.push(new pline(2));
    this.dependentDrawableItems[2].setPoints(this.center.x - (size * this.middleLineSpaceRatio), this.center.y,
            this.center.x + (size * this.middleLineSpaceRatio), this.center.y);
    this.dependentDrawableItems[2].strokeStyle = this.middleLineColor;
    this.dependentDrawableItems[2].size = (size * this.middleLineWeightRatio);
    
    drawableArea.dependentDrawableItems.push(this);
    touchableItems.push(this);
    dominoArray.push(this);
    this.lastPos;
    this.touchAction = function() {
    watchTouch = true;
    activeDomino= this.index;
    lastPos = this.center;
    }
    
    this.releaseAction = function() {
    watchtouch = false;
    activeDomino = -1;
    if (lineDistance(lastPos.x, lastPos.y, touchEvent.clientX, touchEvent.clientY) < 50) {
        console.log("flip");
    }
  }

}
domino.prototype = Object.create(polygon.prototype);
domino.prototype.constructor = domino;


domino.prototype.flipOver = function(){
    if (this.isFaceUp === true){
        this.hiddenFace = this.dependentDrawableItems.slice(0);
        this.dependentDrawableItems.length = 0;
        this.isFaceUp = false;
        this.fillStyle = "rgba(0,0,0,0.75)";
    }else{
        this.dependentDrawableItems = this.hiddenFace.slice(0);
        this.hiddenFace.length = 0;
        this.isFaceUp = true;
        this.fillStyle = "rgba(0,0,0,1)";
    }

}
//=====================================================================================
//CLASS - playerPanel
function playerPanel(activeOrPassive){
  polygon.call(this, 4, false);
  this.strokeStyle = "#00FF00";
  this.heightRatio = 1/4;
  this.widthRatio = 1/2;
  this.statusBar = new playerStatusBar("Active");
  this.dependentDrawableItems[1] = this.statusBar;
  this.activeOrPassive = activeOrPassive;
  //this.player = new player;
  //this.dependentDrawableItems[1] = this.player;
}

playerPanel.prototype = Object.create(polygon.prototype);
playerPanel.prototype.constructor = playerPanel;

playerPanel.prototype.changeSize = function(container, player){
    this.player = player;
    this.dependentDrawableItems[0] = player;
    var containerWidth = container.canvas.width;
    var containerHeight = container.canvas.height;
    this.constrainedSize = ((containerWidth < containerHeight)? containerWidth : containerHeight);
    // arrange position of the player panel
    if (this.activeOrPassive === "active"){
      this.top = containerHeight - containerHeight * this.heightRatio;
      this.right = containerWidth * this.widthRatio;
      this.bottom = containerHeight;
      this.left = 0;
      this.center.y = this.bottom;
      this.center.x = this.left;
    }else if(this.activeOrPassive === "passive"){
      this.top = 0;
      this.right = containerWidth;
      this.bottom = containerHeight * this.heightRatio;
      this.left = containerWidth - containerWidth * this.widthRatio;
      this.center.y = this.top;
      this.center.x = this.right;
    }
  // arrange the panel (temporary outline) - uncomment to see the panel outline
//  this.setPoints(this.left, this.top,
//          this.right, this.top,
//          this.right, this.bottom,
//          this.left, this.bottom);
  
  // calculate the height and width
  this.width = this.right - this.left;
  this.height = this.bottom - this.top;
  
  for (var i = 0; i < this.player.dependentDrawableItems.length; i++){
      
      if (this.constrainedSize < containerHeight){
          this.player.dependentDrawableItems[i].changeSize(this.constrainedSize/18);
      } else {
          this.player.dependentDrawableItems[i].changeSize(this.width/12);
      }
      if (this.player.dependentDrawableItems[i].x && this.player.dependentDrawableItems[i].y) {
            this.player.dependentDrawableItems[i].moveTo(this.player.dependentDrawableItems[i].x, this.player.dependentDrawableItems[i].y);
            }
        else {
            this.player.dependentDrawableItems[i].moveTo(this.left + this.width/8 + this.width * i * 1/8, this.top + this.height/2);
      }
  }
  
  this.statusBar.changeSize(this);
}
//=====================================================================================
//CLASS - playerStatusBar
function playerStatusBar(activeOrPassive){
    polygon.call(this, 4, true);
    this.fillStyle = "rgba(216,216,216,.75)";
    this.heightRatio = 1/5;
    this.widthRatio = 1;
    this.nameDisplay = new text("Player Name", true)
    this.dependentDrawableItems[0] = this.nameDisplay;
    this.dividerThingy = new pline(2);
    this.dependentDrawableItems[1] = this.dividerThingy;
    this.dividerThingy.lineCap = "butt";
    this.dividerThingy.strokeStyle = "#000000";
    this.scoreDisplay = new text("0", true)
    this.dependentDrawableItems[2] = this.scoreDisplay;
    this.activeOrPassive = activeOrPassive;
    this.line = new pline();
}

playerStatusBar.prototype = Object.create(polygon.prototype);
playerStatusBar.prototype.constructor = playerStatusBar;

playerStatusBar.prototype.changeSize = function(container){
    var constrainedSize = container.constrainedSize/25;
    this.activeOrPassive = container.activeOrPassive;
    // inherit the drawItem changeSize action
    drawableItem.prototype.changeSize.call(this, constrainedSize/20);
    
    // arrange position of the status bar relative to the container
    if (this.activeOrPassive === "active"){
        this.top = container.bottom - container.height * this.heightRatio;
        this.right = container.width * this.widthRatio;
        this.bottom = container.bottom;
        this.left = 0;
        this.center.y = this.bottom;
        this.center.x = this.left;
    }else if(this.activeOrPassive === "passive"){
        this.top = container.top;
        this.right = container.right;
        this.bottom = container.bottom * this.heightRatio;
        this.left = container.right - container.width * this.widthRatio;
        this.center.y = this.top;
        this.center.x = this.right;
    }
    // set the vertices of this polygon to the calculated top/bott/left/right
    this.setPoints(this.left, this.top,
            this.right, this.top,
            this.right, this.bottom,
            this.left, this.bottom);
    // calculate the height and width
    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
    
    // arrange the player name and little divider line thingy and score
    this.nameDisplay.text = container.player.name;
        //this line is changing the text size based on height and width - only changed with height before this
    this.nameDisplay.changeSize(constrainedSize);
    this.dividerThingy.changeSize(constrainedSize/20);
    this.scoreDisplay.text = container.player.score;
    this.scoreDisplay.changeSize(constrainedSize);
    // arrange the position of the things inside the status bars
    if (this.activeOrPassive === "active"){
        // the player name
        this.nameDisplay.textAlign = "left";
        this.nameDisplay.moveTo(this.left, this.height/2 + this.top);
        // little divider line thingy
        this.dividerThingy.setPoints(this.left + this.width * 5/6, this.top,
                this.left + this.width * 5/6, this.bottom);
        // score
        this.scoreDisplay.moveTo(this.left + container.width/16 + this.width * 5/6, this.height/2 + this.top);
    }else if (this.activeOrPassive === "passive"){
        // the player name
        this.nameDisplay.textAlign = "right";
        this.nameDisplay.moveTo(this.right - container.width/16, this.height/2);
        // little divider line thingy
        this.dividerThingy.setPoints(this.left + this.width * 1/6, this.top,
                this.left + this.width * 1/6, this.bottom);
        // score
        this.scoreDisplay.textAlign = "right";
        this.scoreDisplay.moveTo(this.right - container.width/16 - this.width * 5/6, this.height/2);
    }
    
    //
}

//=====================================================================================
//CLASS - boneyard
function boneyard(){
    polygon.call(this, 4, true);
    this.sizeRatio = 1/4;
    this.fillStyle = "rgba(216,216,216,0.75)";
    this.boneArray = new Array();
    var tempBoneArray = new Array();
    var boneCounter = 0;
    var i = 0;
    this.numberOfColumns = 7;

    // populate the boneyard with an entire domino set
    while (i < 7){
        for (var j = 0; j <= i; j++){
            this.dependentDrawableItems[boneCounter] = new domino(i, j, 1);
            this.dependentDrawableItems[boneCounter].flipOver();
            boneCounter++;
        }
        i++;
    }
    // wash the bones
    boneCounter = 0;
    tempBoneArray = this.dependentDrawableItems.slice(0);
    this.dependentDrawableItems.length = 0;
    while (tempBoneArray.length > 0){
        boneCounter = Math.floor(Math.random()*tempBoneArray.length);
        this.dependentDrawableItems.push(tempBoneArray[boneCounter]);
        tempBoneArray.splice(boneCounter,1);
    }
}
boneyard.prototype = Object.create(polygon.prototype);
boneyard.prototype.constructor = boneyard;
boneyard.prototype.changeSize = function(container){
    var containerWidth = container.canvas.width;
    var containerHeight = container.canvas.height;
    var constrainedSize = ((containerWidth < containerHeight)? containerWidth : containerHeight);
    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
    this.center.x = containerWidth;
    this.center.y = containerHeight;
    
    // arrange the boneyard
    this.setPoints(containerWidth - containerWidth * this.sizeRatio, containerHeight - containerHeight * this.sizeRatio,
            containerWidth, containerHeight - containerHeight * this.sizeRatio,
            containerWidth, containerHeight,
            containerWidth - containerWidth * this.sizeRatio, containerHeight);
    // arrange the bones in the boneyard
    for (var i = 0; i < this.dependentDrawableItems.length; i++){
        this.dependentDrawableItems[i].changeSize(constrainedSize/36);
        
        this.dependentDrawableItems[i].moveTo(this.center.x - (i % this.numberOfColumns + 1) * containerWidth/32,
                this.center.y - Math.floor(i / this.numberOfColumns + 1) * containerHeight/12);
                 
    }
}
//=====================================================================================
//CLASS - player
function player(name){
    drawableItem.call(this);
    this.name = name;
    this.score = 0;
    //this.hand = new Array();
    //this.hand.length = 7;
    //this.dependentDrawableItems = this.hand.slice(0);
}
player.prototype = Object.create(drawableItem.prototype);
player.prototype.constructor = player;

//=====================================================================================
//CLASS - buttonPanel
function buttonPanel(){
    polygon.call(this, 4, false);
    this.strokeStyle = "#FF00FF";
    this.heightRatio = 1/3;
    this.widthRatio = 1/4;
    this.btnEndTurn = new button("End Turn")
    this.dependentDrawableItems[0] = this.btnEndTurn;
    this.btnPass = new button("Pass")
    this.dependentDrawableItems[1] = this.btnPass;
    this.btnMenu = new button("Menu")
    this.dependentDrawableItems[2] = this.btnMenu;
    this.constrainedSize;
}
buttonPanel.prototype = Object.create(polygon.prototype);
buttonPanel.prototype.constructor = buttonPanel;
buttonPanel.prototype.changeSize = function(container){
    var containerWidth = container.canvas.width;
    var containerHeight = container.canvas.height;
    this.constrainedSize = ((containerWidth < containerHeight)? containerWidth : containerHeight);
    
    // arrange the button panel
    this.center.x = containerWidth - containerWidth * 1/4;
    this.center.y = containerHeight;
    this.left = this.center.x - containerWidth * this.widthRatio;
    this.right = this.center.x;
    this.top = this.center.y - containerHeight * this.heightRatio;
    this.bottom = this.center.y;
    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
    
    // arrange the panel (temporary outline) - uncomment to see the panel outline
    //this.setPoints(this.left, this.top,
    //        this.right, this.top,
    //        this.right, this.bottom,
    //        this.left, this.bottom);
    
    // arrange the dimensions of the menu button in relation to it's container
    this.btnMenu.left = this.left + this.width*17/32;
    this.btnMenu.right = this.right - this.width/16;
    this.btnMenu.top = this.top + this.height/4;
    this.btnMenu.bottom = this.top + this.height/2;
    
    // arrange the dimensions of the pass button in relation to it's container
    this.btnPass.left = this.left + this.width/16;
    this.btnPass.right = this.right - this.width*17/32;
    this.btnPass.top = this.top + this.height/4;
    this.btnPass.bottom = this.top + this.height/2;
    
    // arrange the dimensions of the end turn button in relation to it's container
    this.btnEndTurn.left = this.left + this.width/16;
    this.btnEndTurn.right = this.right - this.width/16;
    this.btnEndTurn.top = this.top + this.height * 5/8;
    this.btnEndTurn.bottom = this.bottom - this.height/8;
    
    //possibly abbreviate the buttons if the screen gets too thin (it's fine for now)
    if (this.constrainedSize < container.height){
        this.btnEndTurn.displayText.text = "End Turn"
    } else {
        this.btnEndTurn.displayText.text = "End Turn"
    }
    
    //change the dependent's sizes
    this.btnMenu.changeSize(this);
    this.btnPass.changeSize(this);
    this.btnEndTurn.changeSize(this);    
    
}
//=====================================================================================
//CLASS - button
function button(displayText){
    polygon.call(this, 4, true);
    this.fillStyle = "rgba(216,216,216,0.75)";
    this.displayText = new text(displayText, true);
    this.dependentDrawableItems[0] = this.displayText;
    this.displayText.textAlign = "center";
}
button.prototype = Object.create(polygon.prototype);
button.prototype.constructor = button;
button.prototype.changeSize = function(container){
    // determine constrained screen size by reversing container down scale
    var constrainedSize = container.constrainedSize/25;
    // set the buttons size based on it's
    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
    this.center.x = this.left + this.width/2;
    this.center.y = this.top + this.height/2;
    // actually set the points of this button based on it's dimensions
    this.setPoints(this.left, this.top,
            this.right, this.top,
            this.right, this.bottom,
            this.left, this.bottom);
    //resize and move the text in relation to this button and it's container
    this.displayText.changeSize(constrainedSize);
    this.displayText.moveTo(this.center.x, this.center.y);
}