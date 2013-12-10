var canvas = document.getElementById('myCanvas');

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
    var size = 0;
    this.center = new point(0,0);
    this.outlineColor = "#ff0000";
    this.lineWidth = 1;
    this.dependentDrawableItems = new Array();
}
//returns the size
drawableItem.prototype.getSize = function getSize(){
    return this.size;
}
// changes the size of this item and the relative size of all dependents
drawableItem.prototype.changeSize = function(newSize){
    var relativeItemSizes = new Array;
    relativeItemSizes.length = this.dependentDrawableItems.length;
    // get the relative size of all dependent items
    for (var i = 0; i < this.dependentDrawableItems.length; i++){
        relativeItemSizes[i] = this.dependentDrawableItems[i].getSize() / this.size;
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
    relativeItems.length = this.dependentDrawableItems.length;
    for (var i = 0; i < relativeItems.length; i++){
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
    this.lineCap = "butt";
    this.vertices = new Array();
    for (var i = 0; i < numberOfVertices; i++){this.vertices[i] = new point(0,0);}
}
pline.prototype = Object.create(drawableItem.prototype);
pline.prototype.parent = drawableItem.prototype;
pline.prototype.constructor = pline;
//changes the size of this object and dependent objects, and moves all vertices
//relative to the center of this object
pline.prototype.changeSize = function(newSize){
    var relativePointDistances = new Array;
    //record relative coordinates Distances and dependent size and distances
    relativePointDistances.length = this.vertices.length;
    for (var i = 0; i < relativePointDistances.length; i++){
        relativePointDistances[i] = new point;
        relativePointDistances[i].x = (this.vertices[i].x - this.center.x)/this.size;
        relativePointDistances[i].y = (this.vertices[i].y - this.center.y)/this.size;
    }
    //change the size of this object and dependent objects
    drawableItem.prototype.changeSize.call(this, newSize);
    //move all the points relative to the center
    for (var i = 0; i < relativePointDistances.length; i++){
        this.vertices[i].x = this.center.x + (relativePointDistances[i].x * this.size);
        this.vertices[i].y = this.center.y + (relativePointDistances[i].y * this.size);
    }
}
//sets any number of arguments into the vertices 
pline.prototype.setPoints = function() {
    for (var i = 0; i < arguments.length; i++){
        if (!(i % 2)){
            this.vertices[(i/2)].x = arguments[i];
        }else{
            this.vertices[((i-1)/2)].y = arguments[i];
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
    ctx.strokeStyle = this.outlineColor;
    ctx.stroke();
    drawableItem.prototype.draw.call(this,ctx);
}
//=====================================================================================
//CLASS - polygon
function polygon(numberOfVertices, isFilledPolygon){
    pline.call(this);
    this.isFilled = isFilledPolygon;
}
polygon.prototype = Object.create(pline.prototype);
polygon.prototype.parent = pline.prototype;
polygon.prototype.constructor = polygon;

//draws the vertices and then draws every object in dependentDrawableItems
pline.prototype.draw = function(ctx){
    ctx.beginPath();
    ctx.moveTo(this.vertices[0].x,this.vertices[0].y);
    for (var i = 1; i < this.vertices.length; i++) {
        ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
    }
    ctx.closePath();
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = this.lineCap;
    ctx.strokeStyle = this.outlineColor;
    if (this.isFilled === true){
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
}
circle.prototype = Object.create(drawableItem.prototype);
circle.prototype.parent = drawableItem.prototype;
circle.prototype.constructor = circle;
circle.prototype.draw = function(ctx){
    ctx.moveTo(this.center.x,this.center.y);
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.size, 0, 2*Math.PI);
    ctx.closePath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.outlineColor;
    if (this.isFilled === true){
        ctx.fill();
    }else {
        ctx.stroke();
    }
    drawableItem.prototype.draw.call(this,ctx);
}
//=====================================================================================
//CLASS - text
function text(textDisplay,isFilledText){
    drawableItem.call(this);
    this.text = textDisplay;
    this.isFilled = isFilledText;
}
text.prototype = Object.create(drawableItem.prototype);
text.prototype.parent = drawableItem.prototype;
text.prototype.constructor = circle;
text.prototype.draw = function(ctx){
    ctx.beginPath();
    ctx.moveTo(this.center.x,this.center.y);
    ctx.closePath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.outlineColor;
    if (this.isFilled === true){
        ctx.fillText(this.text,this.center.x,this.center.y);
    }else {
        ctx.strokeText(this.text,this.center.x,this.center.y);
    }
    drawableItem.prototype.draw.call(this,ctx);
}
//=====================================================================================
//CLASS - pip
function pip(size){
    circle.call(this,true);
    this.changeSize(size);
}
pip.prototype = Object.create(circle.prototype);
pip.prototype.parent = circle.prototype;
pip.prototype.constructor = pip;
//=====================================================================================
//CLASS - pipGroup
function pipGroup(numOfPips,size){
    pline.call(this,4);
//    this.changeSize(size);
    this.setPoints(this.center.x - size/2, this.center.y - size/2,
        this.center.x + size/2, this.center.y - size/2,
        this.center.x + size/2, this.center.y + size/2,
        this.center.x - size/2, this.center.y + size/2);
    for (var i = 0; i < numOfPips; i++){
        this.dependentDrawableItems[i] = new pip(size/10);
        this.dependentDrawableItems[i].x = this.center.x;
        this.dependentDrawableItems[i].y = this.center.y;
        this.dependentDrawableItems[i].isFilled = true;
    }
    switch(numOfPips){
    case 1:
        this.dependentDrawableItems[0].x = this.center.x;
        this.dependentDrawableItems[0].y = this.center.y;
        break;
    case 2:
        this.dependentDrawableItems[0].x = this.center.x - size*4/5;
        this.dependentDrawableItems[0].y = this.center.y - size*4/5;
        this.dependentDrawableItems[1].x = this.center.x + size*4/5;
        this.dependentDrawableItems[1].y = this.center.y + size*4/5;
    default:        
    }
}
pipGroup.prototype = Object.create(pline.prototype);
pipGroup.prototype.parent = pline.prototype;
pipGroup.prototype.constructor = pipGroup;

//----------------------------------------------------------------------
// Objects/variables - top layer is last (except drawable area is first)
//----------------------------------------------------------------------
var drawableArea = new pline(4);

var line1 = new pline(2);
line1.outlineColor = '#ff0000';
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = line1;

var spot = new circle(true);
spot.changeSize(10);
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = spot;

//var spotGroup = new pipGroup(1,2);
//drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = spotGroup;

//var txtLine01 = new drawableItem(1);
//txtLine01.type = "text";
//txtLine01.font = "30px Arial";
//txtLine01.center.x = 10;
//txtLine01.center.y = 20;
//drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = txtLine01;

//var txtLine02 = new drawableItem(1);
//txtLine02.type = "text";
//txtLine02.font = "30px Arial";
//txtLine02.center.x = 10;
//txtLine02.center.y = 30;
//drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = txtLine02;

//var txtLine03 = new drawableItem(1);
//txtLine03.type = "text";
//txtLine03.font = "30px Arial";
//txtLine03.center.x = 10;
//txtLine03.center.y = 40;
//drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = txtLine03;

//var txtLine04 = new drawableItem(1);
//txtLine04.type = "text";
//txtLine04.font = "30px Arial";
//txtLine04.center.x = 10;
//txtLine04.center.y = 50;
//drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = txtLine04;
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

    line1.setPoints(context.canvas.width/2,context.canvas.height/2,0,0);
    line1.lineWidth = drawableArea.size/25;
    
    spot.moveTo(line1.vertices[0].x, line1.vertices[0].y);
    
    
    
//    spotGroup.moveTo(context.canvas.width/4,context.canvas.height/4);
//    spotGroup.changeSize(constrainedSize/4);
    
    
//    txtLine01.text = "y value = " + spotGroup.center.y;
//    txtLine02.text = "x value = " + spotGroup.center.x; 
//    txtLine03.text = "spotGroup size = " + spotGroup.getSize();
//    txtLine04.text = "pip size = " + spotGroup.dependentDrawableItems[0].getSize();
    drawableArea.draw(context);
}

window.addEventListener('resize', drawScreen);
