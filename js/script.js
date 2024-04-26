// Board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// Players
let playerWidth = 10;
let playerHeight = 50;

let player1 = {
  x: 10,
  y: boardHeight / 2,
  width: playerWidth,
  height: playerHeight,
};

let player2 = {
  x: boardWidth - playerWidth - 10,
  y: boardHeight / 2,
  width: playerWidth,
  height: playerHeight,
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
};

function update() {
  requestAnimationFrame(update);

  // Player1
  context.fillStyle = "#ade";
  context.fillRect(player1.x, player1.y, player1.width, player1.height);

  // Player2
  context.fillRect(player2.x, player2.y, player2.width, player2.height);
}
