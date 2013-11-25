//gl is the webgl canvas
var gl;
//this function initializes gl by passing the canvas which is the canvas dom element
function initGL(canvas) {
    try {
	//make 'gl' a webgl context using the standard name
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}



var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;

function initBuffers() {
    //new buffer for the triangle on the graphics card
    triangleVertexPositionBuffer = gl.createBuffer();
    //use the new buffer instead of the "current array buffer." for the triangle
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    //new list which are the vertices of the triangle relative to a center
    var vertices = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];
    //pass the list into the current buffer - Float32Array() makes the list gl compliant
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    //each vertex in the buffer consists of three separate numbers (x,y,z)
    triangleVertexPositionBuffer.itemSize = 3;
    //the buffer is for three separate vertices
    triangleVertexPositionBuffer.numItems = 3;

    //new buffer for the square
    squareVertexPositionBuffer = gl.createBuffer();
    //use the new buffer for the square too
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    //vertices of the square
    vertices = [
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
         1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ];
    //use Float32Array to pass the square list into the current buffer too
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    //define each vertex as having three dimensions (x,y,z)
    squareVertexPositionBuffer.itemSize = 3;
    //there are 4 vertices in this list
    squareVertexPositionBuffer.numItems = 4;
}


function drawScene() {
    //tell gl about the size of the canvas
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    //clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //vertical field of view is 45, width-height ratio of canvas,
    //ignore things closer than 0.1 from viewpoint,
    //ignore things farther than 100 from viewpoint
    //pMatrix (projection matrix)
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    //move to the center of the scene 
    //(set the model view-matrix to the identity matrix)
    mat4.identity(mvMatrix);
    
    //move 1.5 units to the left and 7 units back
    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
    //select the triangle buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    //3 items in the buffer, three numbers long each
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //move javascript model-view matrix to the graphics card
    setMatrixUniforms();
    //draw the array of vertices as a triangle, starting with element 0, to .numItems
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

    //move the model-view matrix 3 units to the right
    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    //attach to the square buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    //difine the buffer as 4 items, three numbers long each
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //move the javascript model-view matrix to the graphics card
    setMatrixUniforms();
    //draw as a triangle strip (a set of triangles with common sides) 2 similar triangles makes a rectangle
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}



function webGLStart() {
    var canvas = document.getElementById("dominos-canvas");
    initGL(canvas);
    initShaders();
    initBuffers();
    
    //background color is black on redraw
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //front-back layer testing
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}
