'use strict';

var gl;
var points;

var mouseX;
var mouseY;
var track = false;

var NumPoints = 50000;

window.onload = function init() {
  var canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  //
  //  Initialize our data for the Sierpinski Gasket
  //

  // First, initialize the corners of our gasket with three points.

  var vertices = [vec2(-1, -1), vec2(0, 1), vec2(1, -1)];

  // Specify a starting point p for our iterations
  // p starts far far away probably in the next galaxy

  var p = vec2(100, 100);

  // And, add our initial point into our array of points

  points = [p];

  // Compute new points
  // Each new point is located midway between
  // last point and a randomly chosen vertex

  for (var i = 0; points.length < NumPoints; ++i) {
    var j = Math.floor(Math.random() * 3);
    p = add(points[i], vertices[j]);
    p = scale(0.5, p);
    points.push(p);
  }

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

  canvas.addEventListener('mousedown', function (e) {
    track = true;
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  });

  canvas.addEventListener('mouseup', function (e) {
    track = false;
  });

  canvas.addEventListener('mousemove', function (e) {
    if (movement) {
      var xmove = (2 * (e.offsetX - mouseX)) / canvas.width;
      mouseX = e.offsetX;
      for (i = 0; i < 4; i++) {
        vertices[i][0] += xmove;
      }

      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    }
  });

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, points.length);
}
