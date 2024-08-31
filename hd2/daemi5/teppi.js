'use strict';

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  //
  //  Initialize our data for the Sierpinski Gasket
  //

  // First, initialize the corners of our gasket with three points.

  var vertices = [vec2(-1, 1), vec2(1, 1), vec2(1, -1), vec2(-1, -1)];

  divideSquare(
    vertices[0],
    vertices[1],
    vertices[2],
    vertices[3],
    NumTimesToSubdivide
  );

  //
  //  Configure WebGL
  //
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers

  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  // Load the data into the GPU

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer

  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  render();
};

function triangle(a, b, c) {
  points.push(a, b, c);
}

function square(strip) {
  points.push(
    strip[0],
    strip[1],
    strip[2],
    strip[3],
    strip[4],
    strip[5],
    strip[6],
    strip[7],
    strip[8],
    strip[9]
  );
}

function divideTriangle(a, b, c, count) {
  // check for end of recursion

  if (count === 0) {
    triangle(a, b, c);
  } else {
    //bisect the sides

    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    --count;

    // three new triangles

    divideTriangle(a, ab, ac, count);
    divideTriangle(c, ac, bc, count);
    divideTriangle(b, bc, ab, count);
  }
}

function divideSquare(a, b, c, d, count) {
  var upperL = mix(a, b, 1 / 3);
  var upperR = mix(a, b, 2 / 3);
  var leftU = mix(a, d, 1 / 3);
  var leftD = mix(a, d, 2 / 3);
  var lowerL = mix(d, c, 1 / 3);
  var lowerR = mix(d, c, 2 / 3);
  var rightU = mix(b, c, 1 / 3);
  var rightD = mix(b, c, 2 / 3);
  var middleUL = mix(upperL, lowerL, 1 / 3);
  var middleLL = mix(upperL, lowerL, 2 / 3);
  var middleUR = mix(upperR, lowerR, 1 / 3);
  var middleLR = mix(upperR, lowerR, 2 / 3);
  if (count === 0) {
    var strip = [
      a,
      middleUL,
      b,
      middleUR,
      c,
      middleLR,
      d,
      middleLL,
      a,
      middleUL,
    ];
    square(strip);
  } else {
    count--;

    divideSquare(a, upperL, middleUL, leftU, count);
    divideSquare(upperL, upperR, middleUR, middleUL, count);
    divideSquare(upperR, b, rightU, middleUR, count);
    divideSquare(leftU, middleUL, middleLL, leftD, count);
    divideSquare(middleUR, rightU, rightD, middleLR, count);
    divideSquare(leftD, middleLL, lowerL, d, count);
    divideSquare(middleLL, middleLR, lowerR, lowerL, count);
    divideSquare(middleLR, rightD, c, lowerR, count);
  }
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, points.length);
}
