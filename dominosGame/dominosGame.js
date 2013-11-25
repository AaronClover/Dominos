    var canvas = document.getElementById('myCanvas');

      
function draw() {
    var context = canvas.getContext('2d');
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;

    context.beginPath();
    context.moveTo(100, 150);
    context.lineTo(450, 50);
    context.lineWidth = 10;
    context.strokeStyle = '#ff0000';
    context.stroke();
    
    context.beginPath();
    context.moveTo(canvas.width/2,canvas.height/2);
    context.lineTo(0,0);
    context.lineWidth = 1;
    context.strokeStyle='#ff0000';
    context.stroke();
    
    // butt line cap (top line)
    context.beginPath();
    context.moveTo(200, canvas.height / 2 - 50);
    context.lineTo(canvas.width - 200, canvas.height / 2 - 50);
    context.lineWidth = 20;
    context.strokeStyle = '#0000ff';
    context.lineCap = 'butt';
    context.stroke();

    // round line cap (middle line)
    context.beginPath();
    context.moveTo(200, canvas.height / 2);
    context.lineTo(canvas.width - 200, canvas.height / 2);
    context.lineWidth = 20;
    context.strokeStyle = '#0000ff';
    context.lineCap = 'round';
    context.stroke();

    // square line cap (bottom line)
    context.beginPath();
    context.moveTo(200, canvas.height / 2 + 50);
    context.lineTo(canvas.width - 200, canvas.height / 2 + 50);
    context.lineWidth = 20;
    context.strokeStyle = '#0000ff';
    context.lineCap = 'square';
    context.stroke();
}
window.addEventListener('resize', draw);
