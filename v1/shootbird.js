var canvas;
var winText;
var gl;

// coordinates
var score = [];
var score_count = 0;
var vertices;
var bird;
var bird_speed = 0.005;
var bullets = [];
var bullet_speed = 0.015;

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);

  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  // Triangle vertices for player
  vertices = [vec2(0, -0.76), vec2(-0.05, -0.9), vec2(0.05, -0.9)];

  bird = [
    vec2(0, 0.8), // 0
    vec2(0.07, 0.8), // 1
    vec2(0.07, 0.83), // 2
    vec2(0.07, 0.8), // 3
    vec2(0.07, 0.83), // 4
    vec2(0.17, 0.8), // 5
    vec2(0.07, 0.8), // 6
    vec2(0.17, 0.8), // 7
    vec2(0.17, 0.77), // 8
    vec2(0.17, 0.8), // 9
    vec2(0.17, 0.7), // 10
    vec2(0.42, 0.8),
    vec2(0.17, 0.7),
    vec2(0.42, 0.7),
    vec2(0.42, 0.8),
    vec2(0.35, 0.7),
    vec2(0.41, 0.7),
    vec2(0.45, 0.62),
    vec2(0.42, 0.71), // 18
    vec2(0.42, 0.75),
    vec2(0.5, 0.69),
  ];

  // Move bird to starting pos and a bit of rescaling.
  for (let i = 0; i < bird.length; i++) {
    bird[i][0] = 2 + (bird[i][0] * 2) / 3;
  }

  // Load the data into the GPU
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

  // Allocate a buffer big enough for player and bullets
  gl.bufferData(
    gl.ARRAY_BUFFER,
    28 * 3 * 2 * Float32Array.BYTES_PER_ELEMENT, // 1 player, 20 bullets, 7 for bird
    gl.DYNAMIC_DRAW
  );

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Mouse down handler (to shoot bullets)
  canvas.addEventListener('mousedown', function (e) {
    var newBullet = [
      vec2(vertices[0][0], vertices[0][1]),
      vec2(
        (vertices[1][0] + vertices[0][0]) / 2,
        (vertices[1][1] + vertices[0][1]) / 2
      ),
      vec2(
        (vertices[2][0] + vertices[0][0]) / 2,
        (vertices[2][1] + vertices[0][1]) / 2
      ),
    ];
    bullets.push(newBullet);

    updateBufferData();
  });

  // Mouse movement handler (to move the player)
  canvas.addEventListener('mousemove', function (e) {
    var xmove = (2 * e.offsetX) / canvas.width;

    vertices[0][0] = xmove - 1;
    vertices[1][0] = xmove - 1.05;
    vertices[2][0] = xmove - 0.95;

    updateBufferData();
  });

  render();
};

function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
<<<<<<< HEAD
    if (!bullets[i] || bullets[i].length !== 3) {
      continue;
    }

    for (let j = 0; j < 3; j++) {
      bullets[i][j][1] += bullet_speed;

      if (bullets[i][j][1] > 1) {
        bullets.splice(i, 1);
        i--; // Adjust index after removal
        break;
      }
=======
    for (let j = 0; j < .length; j++) {
        const element = array[j];
        
>>>>>>> afc8f918958d3c0557c5d8a08770125e11a71733
    }
  }
}

function moveBird() {
  for (let i = 0; i < bird.length; i++) {
    bird[i][0] -= bird_speed;
  }
  if (bird[0][0] < -2) resetBird();
}

function resetBird() {
  // reset to starting pos
  for (let i = 0; i < bird.length; i++) {
    bird[i][0] += 4;
  }

  // new starting point on the y-axis
  var ymove = Math.random() * 0.2 - 0.1;
  if (bird[0][1] > 0.9) {
    ymove = ymove > 0 ? -ymove : ymove;
  }
  if (bird[0][1] < 0.7) {
    ymove = ymove < 0 ? -ymove : ymove;
  }
  for (let i = 0; i < bird.length; i++) {
    bird[i][1] += ymove;
  }
}

function checkCollision() {
  var x2_max = bird[18][0];
  var x2_min = bird[7][0];
  var y2_max = bird[0][1];
  var y2_min = bird[10][1];

  for (let i = 0; i < bullets.length; i++) {
    var x1_max = bullets[i][2][0];
    var x1_min = bullets[i][1][0];
    var y1_max = bullets[i][0][1];
    var y1_min = bullets[i][1][1];

    if (
      x1_max >= x2_min &&
      x2_max >= x1_min &&
      y1_max >= y2_min &&
      y2_max >= y1_min
    ) {
      console.log('COLLISION');
      resetBird();
      addScore();
    }
  }
}

function addScore() {
  var new_score = [
    vec2(-0.95, 0.95),
    vec2(-0.94, 0.95),
    vec2(-0.95, 0.8),
    vec2(-0.94, 0.95),
    vec2(-0.95, 0.8),
    vec2(-0.94, 0.8),
  ];
  for (let i = 0; i < new_score.length; i++) {
    new_score[i][0] += score_count / 40;
  }
  score_count++;
  score.push(new_score);
}

function youWin() {
  winText = document.getElementById('win-text');
  canvas.style.display = 'none';
  winText.style.display = 'block';
}

function updateBufferData() {
  var memIndex = 0;
  if (bullets.length > 0) {
    for (let i = 0; i < bullets.length; i++) {
      gl.bufferSubData(gl.ARRAY_BUFFER, memIndex, flatten(bullets[i]));
      memIndex += bullets[i].length * 2 * Float32Array.BYTES_PER_ELEMENT;
    }
  }
  if (score_count > 0) {
    for (let i = 0; i < score_count; i++) {
      gl.bufferSubData(gl.ARRAY_BUFFER, memIndex, flatten(score[i]));
      memIndex += score[i].length * 2 * Float32Array.BYTES_PER_ELEMENT;
    }
  }
  gl.bufferSubData(gl.ARRAY_BUFFER, memIndex, flatten(vertices));
  memIndex += 6 * Float32Array.BYTES_PER_ELEMENT;
  gl.bufferSubData(gl.ARRAY_BUFFER, memIndex, flatten(bird));
}

function render() {
  moveBullets();
  moveBird();
  checkCollision();
  updateBufferData(); // Update data before rendering

  if (score_count > 4) {
    youWin();
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  var memIndex = 0;
  // Draw player
  gl.drawArrays(gl.TRIANGLES, memIndex, vertices.length);
  memIndex += vertices.length;

  // Draw bird
  gl.drawArrays(gl.TRIANGLES, vertices.length, bird.length);
  memIndex += bird.length;

  // Draw score
  if (score_count > 0) {
    gl.drawArrays(gl.TRIANGLES, memIndex, score_count * 6);
    memIndex += score_count * 6;
  }

  // Draw bullets
  if (bullets.length > 0) {
    gl.drawArrays(gl.TRIANGLES, memIndex, bullets.length * 3);
  }

  window.requestAnimFrame(render);
}
