var canvas = document.getElementById('myCanvas');

//------------------------------------------
// Classes
//------------------------------------------

function point(x,y){
    this.x = x;
    this.y = y;
}

function drawableItem(numberOfVertices) {
    //properties
    //-----------------------------------------------------
    var size = 0;
    this.center = new point(0,0);
    this.type = "pline";
    this.outlineColor = "#ff0000";
    this.lineWidth = 1;
    this.isFilled = false;
    this.lineCap = "butt";
    this.text = "someText"
    this.vertices = new Array();
    for (var i = 0; i < numberOfVertices; i++){this.vertices[i] = new point(0,0);}
    this.dependentDrawableItems = new Array();
    
    // Methods
    //------------------------------------------------------
    //returns the size
    this.getSize = function getSize(){
        return size;
    }
    // changes the size of this item and the relative size of all dependents
    this.changeSize = function changeSize(newSize){

        var relativePointDistances = new Array;
        var relativeItemSizes = new Array;
        
        //record relative coordinates Distances and dependent size and distances
        relativePointDistances.length = this.vertices.length;
        for (var i = 0; i < relativePointDistances.length; i++){
            relativePointDistances[i] = new point;
            relativePointDistances[i].x = (this.vertices[i].x - this.center.x)/size;
            relativePointDistances[i].y = (this.vertices[i].y - this.center.y)/size;
        }
        relativeItemSizes.length = this.dependentDrawableItems.length;
        // get the relative size of all dependent items
        for (var i = 0; i < this.dependentDrawableItems.length; i++){
            relativeItemSizes[i] = this.dependentDrawableItems[i].getSize() / size;
        }
        // change the size
        size = newSize;
        // apply the ratio of change back to all dependent items
        for (var i = 0; i < relativeItemSizes.length; i++){
            this.dependentDrawableItems[i].changeSize(relativeItemSizes[i] * newSize);
        }
        //move all the points relative to the center
        for (var i = 0; i < relativePointDistances.length; i++){
            this.vertices[i].x = this.center.x + (relativePointDistances[i].x * size);
            this.vertices[i].y = this.center.y + (relativePointDistances[i].y * size);
        }
    }
    // sets any number of arguments into the vertices 
    this.setPoints = function setPoints(){
        for (var i = 0; i < arguments.length; i++){
            if (!(i % 2)){
                this.vertices[(i/2)].x = arguments[i];
            }else{
                this.vertices[((i-1)/2)].y = arguments[i];
            }
        }
    }
    // moves all the vertices and every dependent item an incremental amount
    this.moveItem = function moveItem(moveX,moveY){
        for (var i = 0; i < this.vertices.length; i++){
            this.vertices[i].x = this.vertices[i].x + moveX;
            this.vertices[i].y = this.vertices[i].y + moveY;
        }
        for (var i = 0; i < this.dependentDrawableItems.length; i++) {
            this.dependentDrawableItems[i].moveItem(moveX,moveY);
        }
    }
    //moves all the vertices and every dependent to an absolute point based on center
    this.moveItemTo = function moveItemTo(moveX,moveY){
        var relativePoints = new Array;
        var relativeItems = new Array;
        //record relative coordinates
        relativePoints.length = this.vertices.length;
        relativeItems.length = this.dependentDrawableItems.length;
        for (var i = 0; i < relativePoints.length; i++){
            relativePoints[i] = new point;
            relativePoints[i].x = this.vertices[i].x - this.center.x;
            relativePoints[i].y = this.vertices[i].y - this.center.y;
        }
        for (var i = 0; i < relativeItems.length; i++){
            relativeItems[i] = new point;
            relativeItems[i].x = this.dependentDrawableItems[i].center.x - this.center.x;
            relativeItems[i].y = this.dependentDrawableItems[i].center.y - this.center.y;
        }
        //move the center
        this.center.x = moveX;
        this.center.y = moveY;
        //move all the points and items relative to the center
        for (var i = 0; i < relativePoints.length; i++){
            this.vertices[i].x = this.center.x + relativePoints[i].x;
            this.vertices[i].y = this.center.y + relativePoints[i].y;
        }
        for (var i = 0; i < relativeItems.length; i++){
            this.dependentDrawableItems[i].moveItemTo(this.center.x + relativeItems[i].x,
                    this.center.y + relativeItems[i].y);
        }
    }
    // draws the vertices and then draws every object in dependentDrawableItems
    this.draw = function draw(ctx){
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x,this.vertices[0].y);
        if (this.type === "closedPline"){
	    for (var i = 1; i < this.vertices.length; i++) {
	        ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
	    }
	    ctx.closePath();
	}
        if (this.type === "pline"){
            for (var i = 1; i < this.vertices.length; i++) {
                ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
            }
            this.isFilled = false;
        }
        if (this.type === "circle"){
            ctx.arc(this.center.x, this.center.y, size, 0, 2*Math.PI);
            ctx.closePath();
        }
	ctx.lineWidth = this.lineWidth;
	ctx.lineCap = this.lineCap;
	ctx.strokeStyle = this.outlineColor;
	if (this.isFilled === true){
	    ctx.fill();
	}else if(this.type === "text"){
	    ctx.fillText(this.text,this.center.x,this.center.y);
	}else {
	    ctx.stroke();
	}
	
        for (var i = 0; i < this.dependentDrawableItems.length; i++) {
            this.dependentDrawableItems[i].draw(ctx);
        }
    }
}

function pip(size){
    drawableItem.call(this,1);
    this.type = "circle";
    this.isFilled = true;
    this.changeSize(size);
}

function pipGroup(numOfPips,size){
    drawableItem.call(this,4);
    this.type = "closedPline";
    this.changeSize(size);
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

//----------------------------------------------------------------------
// Objects/variables - top layer is last (except drawable area is first)
//----------------------------------------------------------------------
var drawableArea = new drawableItem(4);

var line1 = new drawableItem(2);
line1.outlineColor = '#ff0000';
line1.type = "pline";
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = line1;

//var spot = new pip(10);
//spot.isFilled = true;
//drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = spot;

var spotGroup = new pipGroup(1,10);
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = spotGroup;

var txtLine01 = new drawableItem(1);
txtLine01.type = "text";
txtLine01.font = "30px Arial";
txtLine01.center.x = 10;
txtLine01.center.y = 20;
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = txtLine01;

var txtLine02 = new drawableItem(1);
txtLine02.type = "text";
txtLine02.font = "30px Arial";
txtLine02.center.x = 10;
txtLine02.center.y = 30;
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = txtLine02;

var txtLine03 = new drawableItem(1);
txtLine03.type = "text";
txtLine03.font = "30px Arial";
txtLine03.center.x = 10;
txtLine03.center.y = 40;
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = txtLine03;

var txtLine04 = new drawableItem(1);
txtLine04.type = "text";
txtLine04.font = "30px Arial";
txtLine04.center.x = 10;
txtLine04.center.y = 50;
drawableArea.dependentDrawableItems[drawableArea.dependentDrawableItems.length] = txtLine04;
//------------------------------------------
// Draw loop
//------------------------------------------
function draw() {
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
       
//    spot.vertices[0].x = context.canvas.width/2;
//    spot.vertices[0].y = context.canvas.height/2;
//    spot.changeSize(constrainedSize/50);
    
    spotGroup.moveItemTo(context.canvas.width/4,context.canvas.height/4);
    spotGroup.changeSize(constrainedSize/4);
    
    
    txtLine01.text = "y value = " + spotGroup.center.y;
    txtLine02.text = "x value = " + spotGroup.center.x; 
    txtLine03.text = "spotGroup size = " + spotGroup.getSize();
    txtLine04.text = "pip size = " + spotGroup.dependentDrawableItems[0].getSize();
    drawableArea.draw(context);
}

window.addEventListener('resize', draw);
