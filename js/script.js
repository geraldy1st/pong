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

// Ball

let ballWidth = 10;
let ballHeight = 10;
let ball = {
  x: boardWidth / 2,
  y: boardHeight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: 1,
  velocityY: 2,
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

  // Ball
  context.fillStyle = "#FFF";
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
    ball.velocityY *= -1;
  }
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

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && // a's top left corner doesnt reach b's top corner
    a.x + a.width > b.x && // a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's bottom left corner passes b's top left corner
    a.y + a.height > b.y // a's bottom left corner passes b's top left corner
  );
}
