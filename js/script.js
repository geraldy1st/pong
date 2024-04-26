// Board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// Players
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

let player1 = {
  x: 10,
  y: boardHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: playerVelocityY,
};

let player2 = {
  x: boardWidth - playerWidth - 10,
  y: boardHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: playerVelocityY,
};

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // Use for drawing on the board

  // Draw inital player1
  context.fillStyle = "#ade";
  context.fillRect(player1.x, player1.y, player1.width, player1.height);

  requestAnimationFrame(update);
  document.addEventListener("keyup", movePlayer);
};

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, boardHeight);

  // Player1
  context.fillStyle = "#ade";
  // player1.y += player1.velocityY;
  let nextPlayer1Y = player1.y + player1.velocityY;
  if (!outOfBounds(nextPlayer1Y)) {
    player1.y = nextPlayer1Y;
  }
  context.fillRect(player1.x, player1.y, player1.width, player1.height);

  // Player2
  // player2.y += player2.velocityY;
  let nextPlayer2Y = player2.y + player2.velocityY;
  if (!outOfBounds(nextPlayer2Y)) {
    player2.y = nextPlayer2Y;
  }
  context.fillRect(player2.x, player2.y, player2.width, player2.height);
}

function outOfBounds(yPosition) {
  return yPosition < 0 || yPosition + playerHeight > boardHeight;
}

function movePlayer(e) {
  // Player1
  if (e.code == "KeyS") {
    player1.velocityY = -3;
  } else if (e.code == "KeyZ") {
    player1.velocityY = 3;
  }

  // Player2
  if (e.code == "ArrowUp") {
    player2.velocityY = -3;
  } else if (e.code == "ArrowDown") {
    player2.velocityY = 3;
  }
}
