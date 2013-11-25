var canvas = document.getElementById('myCanvas');
function point(){
    this.x = 0;
    this.y = 0;
}
function drawableItem() {
    this.size = 0;
    this.center = new point();
    this.vertices = new Array();
    this.mySize = function mySize(){return this.size;}
    this.adjustSize = function adustSize(tableSize){
	this.size = tableSize;
    }
}
var table = new drawableItem();
table.vertices[0] = new point();
table.vertices[1] = new point();
table.vertices[2] = new point();
table.vertices[3] = new point();

      
function draw() {
    var context = canvas.getContext('2d');
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;

    
    if (context.canvas.width > context.canvas.height){
	table.size = context.canvas.height;
	context.canvas.orientation = "landscape";
    }else{
	table.size = context.canvas.width;
	context.canvas.orientation = "portait";
    }
    
    if(context.canvas.orientation = "landscape"){
	table.vertices[0].x = 0;
	table.vertices[0].y = 0;
	table.vertices[1].x = table.size;
	table.vertices[1].y = 0;
	table.vertices[2].x = table.size;
	table.vertices[2].y = table.size;
	table.vertices[3].x = 0;
	table.vertices[3].y = table.size;
    }
    
    context.beginPath();
    context.moveTo(table.vertices[0].x,table.vertices[0].y);
    context.lineTo(table.vertices[1].x,table.vertices[1].y);
    context.lineTo(table.vertices[2].x,table.vertices[2].y);
    context.lineTo(table.vertices[3].x,table.vertices[3].y);
    context.lineTo(table.vertices[0].x,table.vertices[0].y);
    context.lineWidth = 1;
    context.strokeStyle = '#ff0000';
    context.stroke();
    
    context.beginPath();
    context.moveTo(table.size/2,table.size/2);
    context.lineTo(0,0);
    context.lineWidth = 1;
    context.strokeStyle='#ff0000';
    context.stroke();
    
    // butt line cap (top line)
    context.beginPath();
    context.moveTo(table.size / 6, table.size / 2 - table.size/10);
    context.lineTo(5 * table.size / 6, table.size / 2 - table.size/10);
    context.lineWidth = table.size/50;
    context.strokeStyle = '#0000ff';
    context.lineCap = 'butt';
    context.stroke();

    // round line cap (middle line)
    context.beginPath();
    context.moveTo(table.size / 6, table.size / 2);
    context.lineTo(5 * table.size / 6, table.size / 2);
    context.lineWidth = table.size/50;
    context.strokeStyle = '#0000ff';
    context.lineCap = 'round';
    context.stroke();

    // square line cap (bottom line)
    context.beginPath();
    context.moveTo(table.size / 6, table.size / 2 + table.size/10);
    context.lineTo(5 * table.size / 6, table.size / 2 + table.size/10);
    context.lineWidth = table.size/50;
    context.strokeStyle = '#0000ff';
    context.lineCap = 'square';
    context.stroke();
}
window.addEventListener('resize', draw);
