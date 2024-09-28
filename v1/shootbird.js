var canvas;
var gl;

// Bullet coordianates
var bullets;
var bullet_speed = 0.01;

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Triangle vertices
  var vertices = [vec2(0, -0.76), vec2(-0.05, -0.9), vec2(0.05, -0.9)];

  // Load the data into the GPU
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Mouse down handler
  canvas?.addEventListener("mousedown", function (e) {
    var new_bullet = [
      vertices[0],
      (vertices[1] + vertices[0]) / 2,
      (vertices[2] + vertices[0]) / 2,
    ];

    bullets.push(new_bullet);
  });

  // Mouse movement handler
  canvas.addEventListener("mousemove", function (e) {
    var xmove = (2 * e.offsetX) / canvas.width;

    vertices[0][0] = xmove - 1;
    vertices[1][0] = xmove - 1.05;
    vertices[2][0] = xmove - 0.95;

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
  });

  render();
};

function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < .length; j++) {
        const element = array[j];
        
    }
  }
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3); // Draw the triangle
  window.requestAnimFrame(render);
}
