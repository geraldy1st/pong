// Board
let board;
let boardWidth = 500; // This will be adjusted dynamically
let boardHeight = 500; // This will be adjusted dynamically
let context;

// Players
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

let player1 = {
  x: 10,
  y: boardHeight / 2 - playerHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: playerVelocityY,
};

let player2 = {
  x: boardWidth - playerWidth - 10,
  y: boardHeight / 2 - playerHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: playerVelocityY,
};

// Ball
let ballWidth = 10;
let ballHeight = 10;
let ball = {
  x: boardWidth / 2 - ballWidth / 2,
  y: boardHeight / 2 - ballHeight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: 1,
  velocityY: 2,
};

// Score
let player1Score = 0;
let player2Score = 0;

window.onload = function () {
  board = document.getElementById("board");
  context = board.getContext("2d"); // Use for drawing on the board

  // Adjust canvas size
  adjustCanvasSize();
  window.addEventListener("resize", adjustCanvasSize);

  // Initial draw
  drawPlayer(player1);
  drawPlayer(player2);

  requestAnimationFrame(update);
  document.addEventListener("keydown", movePlayer);
  document.addEventListener("keyup", stopPlayer);

  // Add event listeners for buttons
  document
    .getElementById("p1-up")
    .addEventListener("touchstart", () =>
      movePlayer({ code: "KeyS", type: "keydown" })
    );
  document
    .getElementById("p1-down")
    .addEventListener("touchstart", () =>
      movePlayer({ code: "KeyZ", type: "keydown" })
    );
  document
    .getElementById("p2-up")
    .addEventListener("touchstart", () =>
      movePlayer({ code: "ArrowUp", type: "keydown" })
    );
  document
    .getElementById("p2-down")
    .addEventListener("touchstart", () =>
      movePlayer({ code: "ArrowDown", type: "keydown" })
    );

  document
    .getElementById("p1-up")
    .addEventListener("touchend", () =>
      stopPlayer({ code: "KeyS", type: "keyup" })
    );
  document
    .getElementById("p1-down")
    .addEventListener("touchend", () =>
      stopPlayer({ code: "KeyZ", type: "keyup" })
    );
  document
    .getElementById("p2-up")
    .addEventListener("touchend", () =>
      stopPlayer({ code: "ArrowUp", type: "keyup" })
    );
  document
    .getElementById("p2-down")
    .addEventListener("touchend", () =>
      stopPlayer({ code: "ArrowDown", type: "keyup" })
    );

  // Disable right-click context menu
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Add event listener for reset button
  document.getElementById("reset-button").addEventListener("click", resetScore);
};

function adjustCanvasSize() {
  const width = Math.min(window.innerWidth * 0.9, 500);
  board.width = width;
  board.height = width; // Maintain aspect ratio
  boardWidth = width;
  boardHeight = width;

  // Update player and ball positions based on new canvas size
  player1.y = boardHeight / 2 - playerHeight / 2;
  player2.x = boardWidth - playerWidth - 10;
  player2.y = boardHeight / 2 - playerHeight / 2;
  ball.x = boardWidth / 2 - ballWidth / 2;
  ball.y = boardHeight / 2 - ballHeight / 2;
}

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  // Player1
  updatePlayer(player1);
  drawPlayer(player1);

  // Player2
  updatePlayer(player2);
  drawPlayer(player2);

  // Ball
  updateBall();
  drawBall();

  // Score
  drawScore();
}

function updatePlayer(player) {
  let nextY = player.y + player.velocityY;
  if (!outOfBounds(nextY, player.height)) {
    player.y = nextY;
  }
}

function updateBall() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Ball collision with top or bottom of canvas
  if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
    ball.velocityY *= -1; // Reverse direction
  }

  // Ball collision with players
  if (detectCollision(ball, player1) && ball.velocityX < 0) {
    ball.velocityX *= -1;
  } else if (detectCollision(ball, player2) && ball.velocityX > 0) {
    ball.velocityX *= -1;
  }

  // Game over
  if (ball.x < 0) {
    player2Score++;
    resetGame(1);
  } else if (ball.x + ball.width > boardWidth) {
    player1Score++;
    resetGame(-1);
  }
}

function drawPlayer(player) {
  context.fillStyle = "#ade";
  context.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall() {
  context.fillStyle = "#FFF";
  context.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function drawScore() {
  context.font = "45px sans-serif";
  context.fillText(player1Score, boardWidth / 5, 45);
  context.fillText(player2Score, boardWidth - 120, 45);

  // Draw dotted line down the middle
  context.fillStyle = "#FFF";
  for (let i = 10; i < board.height; i += 25) {
    context.fillRect(board.width / 2 - 2.5, i, 5, 5);
  }
}

function outOfBounds(yPosition, height) {
  return yPosition < 0 || yPosition + height > boardHeight;
}

function movePlayer(e) {
  switch (e.code) {
    // Player1
    case "KeyS":
      player1.velocityY = -3;
      break;
    case "KeyZ":
      player1.velocityY = 3;
      break;
    // Player2
    case "ArrowUp":
      player2.velocityY = -3;
      break;
    case "ArrowDown":
      player2.velocityY = 3;
      break;
  }
}

function stopPlayer(e) {
  switch (e.code) {
    // Player1
    case "KeyS":
    case "KeyZ":
      player1.velocityY = 0;
      break;
    // Player2
    case "ArrowUp":
    case "ArrowDown":
      player2.velocityY = 0;
      break;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function resetGame(direction) {
  ball.x = boardWidth / 2 - ballWidth / 2;
  ball.y = boardHeight / 2 - ballHeight / 2;

  ball.velocityX = direction * 2;
  ball.velocityY = 2;
}

function resetScore() {
  player1Score = 0;
  player2Score = 0;
}
