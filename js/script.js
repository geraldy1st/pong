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

let powerUps = []; // Array to hold power-ups

// Sound effects
let hitSound = new Audio("audio/09 SFX.mp3");
let scoreSound = new Audio("audio/18 SFX.mp3");

// Add these variables at the top with the other declarations
let gameStarted = false;
let gameMenu;
let instructionsVisible = false;
let winningScore = 10;

// Add these new variables at the top with other declarations
const POWER_UP_TYPES = [
  { type: "speedBoost", color: "#ff2d55", chance: 0.3, name: "Overclock" },
  { type: "paddleGrow", color: "#00fff9", chance: 0.2, name: "Amplifier" },
  { type: "paddleShrink", color: "#ff0066", chance: 0.2, name: "Virus" },
  { type: "multiBall", color: "#b026ff", chance: 0.15, name: "Duplicator" },
  { type: "reverseControls", color: "#fff600", chance: 0.15, name: "Malware" },
];

// Add this with other game variables
let balls = []; // Array to hold multiple balls
let controlsReversed = false;
let classicMode = false;

// Add these variables at the top with other declarations
let isPaused = false;
let pauseButton;

// Add these variables at the top with other declarations
let cpuMode = false;
let cpuSpeed = 3;
let cpuReactionDelay = 0.1; // Seconds of delay before CPU reacts

// Add these variables at the top with other declarations
const CPU_DIFFICULTIES = {
  EASY: {
    speed: 2,
    reactionDelay: 0.3,
    predictionError: 0.2,
    maxPredictionDistance: 0.7,
  },
  NORMAL: {
    speed: 3,
    reactionDelay: 0.1,
    predictionError: 0.1,
    maxPredictionDistance: 0.85,
  },
  UNBEATABLE: {
    speed: 4,
    reactionDelay: 0,
    predictionError: 0,
    maxPredictionDistance: 1,
  },
};

let currentDifficulty = CPU_DIFFICULTIES.EASY;

window.onload = function () {
  board = document.getElementById("board");
  context = board.getContext("2d"); // Use for drawing on the board
  gameMenu = document.getElementById("game-menu");

  // Adjust canvas size
  adjustCanvasSize();
  window.addEventListener("resize", adjustCanvasSize);

  // Hide the game menu when start button is clicked
  document.getElementById("start-game").addEventListener("click", startGame);

  // Initial draw
  drawPlayer(player1);
  drawPlayer(player2);

  // Only start the game loop when the game starts
  if (gameStarted) {
    requestAnimationFrame(update);
  }

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

  // Generate power-ups at regular intervals
  setInterval(generatePowerUp, 5000); // Generate a power-up every 5 seconds

  // Add this with the other event listeners
  document
    .getElementById("options-button")
    .addEventListener("click", toggleInstructions);

  // Initialize balls array with the main ball
  balls = [ball];

  // Add classic mode toggle listener
  document
    .getElementById("classic-mode")
    .addEventListener("change", function (e) {
      classicMode = e.target.checked;
      // Clear existing power-ups when switching to classic mode
      if (classicMode) {
        powerUps = [];
      }
    });

  // Add pause button functionality
  pauseButton = document.getElementById("pause-button");
  pauseButton.addEventListener("click", togglePause);

  // Add keyboard shortcut for pause
  document.addEventListener("keydown", function (e) {
    if (e.code === "Escape" && gameStarted) {
      togglePause();
    }
  });

  // Remove the old CPU mode listener and add the new opponent selection listeners
  document
    .getElementById("player-mode")
    .addEventListener("change", function (e) {
      if (e.target.checked) {
        cpuMode = false;
        document.getElementById("cpu-difficulty").classList.add("hidden");
        updateControlsVisibility();
      }
    });

  document.getElementById("cpu-mode").addEventListener("change", function (e) {
    if (e.target.checked) {
      cpuMode = true;
      document.getElementById("cpu-difficulty").classList.remove("hidden");
      updateControlsVisibility();
    }
  });

  // Add difficulty listeners
  document.getElementById("easy-mode").addEventListener("change", function (e) {
    if (e.target.checked) currentDifficulty = CPU_DIFFICULTIES.EASY;
  });

  document
    .getElementById("normal-mode")
    .addEventListener("change", function (e) {
      if (e.target.checked) currentDifficulty = CPU_DIFFICULTIES.NORMAL;
    });

  document
    .getElementById("unbeatable-mode")
    .addEventListener("change", function (e) {
      if (e.target.checked) currentDifficulty = CPU_DIFFICULTIES.UNBEATABLE;
    });
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
  if (!gameStarted || isPaused) return;

  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  // Update CPU if in CPU mode
  if (cpuMode) {
    updateCPU();
  }

  // Update and draw players
  updatePlayer(player1);
  updatePlayer(player2);
  drawPlayer(player1);
  drawPlayer(player2);

  // Update and draw all balls
  for (let i = balls.length - 1; i >= 0; i--) {
    const currentBall = balls[i];
    updateBall(currentBall, i);
    drawBall(currentBall);
  }

  drawScore();

  // Only update power-ups if not in classic mode
  if (!classicMode) {
    updatePowerUps();
  }
}

function updatePlayer(player) {
  let nextY = player.y + player.velocityY;
  if (!outOfBounds(nextY, player.height)) {
    player.y = nextY;
  }
}

function updateBall(ball, index) {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Ball collision with top or bottom of canvas
  if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
    ball.velocityY *= -1; // Reverse direction
  }

  // Ball collision with players
  if (detectCollision(ball, player1) && ball.velocityX < 0) {
    ball.velocityX *= -1;
    hitSound.play(); // Play hit sound
  } else if (detectCollision(ball, player2) && ball.velocityX > 0) {
    ball.velocityX *= -1;
    hitSound.play(); // Play hit sound
  }

  // Game over
  if (ball.x < 0) {
    player2Score++;
    if (player2Score >= winningScore) {
      endGame("Player 2");
    } else {
      resetGame(1);
    }
  } else if (ball.x + ball.width > boardWidth) {
    player1Score++;
    if (player1Score >= winningScore) {
      endGame("Player 1");
    } else {
      resetGame(-1);
    }
  }
}

function drawPlayer(player) {
  context.fillStyle = "#ade";
  context.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall(ball) {
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
  if (!gameStarted || isPaused) return;

  let velocity = 3;
  if (controlsReversed) velocity *= -1;

  switch (e.code) {
    case "KeyS":
      player1.velocityY = -velocity;
      break;
    case "KeyZ":
      player1.velocityY = velocity;
      break;
    case "ArrowUp":
      if (!cpuMode) player2.velocityY = -velocity;
      break;
    case "ArrowDown":
      if (!cpuMode) player2.velocityY = velocity;
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
      if (!cpuMode) player2.velocityY = 0;
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

  scoreSound.play(); // Play score sound
}

function resetScore() {
  player1Score = 0;
  player2Score = 0;
  gameStarted = false;
  gameMenu.classList.remove("hidden");

  // Reset ball position
  resetGame(1);
}

function generatePowerUp() {
  // Don't generate power-ups in classic mode
  if (classicMode) return;

  const random = Math.random();
  let accumulatedChance = 0;

  let selectedType = POWER_UP_TYPES[0];
  for (const powerUpType of POWER_UP_TYPES) {
    accumulatedChance += powerUpType.chance;
    if (random <= accumulatedChance) {
      selectedType = powerUpType;
      break;
    }
  }

  let powerUpX = Math.random() * (boardWidth - 20) + 10;
  let powerUpY = Math.random() * (boardHeight - 20) + 10;

  let newPowerUp = {
    x: powerUpX,
    y: powerUpY,
    width: 15,
    height: 15,
    type: selectedType.type,
    color: selectedType.color,
    duration: 5000,
  };

  powerUps.push(newPowerUp);
}

function updatePowerUps() {
  // Loop through all power-ups and draw them
  for (let i = 0; i < powerUps.length; i++) {
    let powerUp = powerUps[i];
    drawPowerUp(powerUp);

    // Check for collision with the ball
    if (detectCollision(powerUp, ball)) {
      activatePowerUp(powerUp);
      powerUps.splice(i, 1); // Remove power-up after activation
    }
  }
}

function drawPowerUp(powerUp) {
  context.fillStyle = powerUp.color;
  context.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
}

function activatePowerUp(powerUp) {
  switch (powerUp.type) {
    case "speedBoost":
      balls.forEach((ball) => {
        ball.velocityX *= 1.5;
        ball.velocityY *= 1.5;
      });
      setTimeout(() => {
        balls.forEach((ball) => {
          ball.velocityX /= 1.5;
          ball.velocityY /= 1.5;
        });
      }, powerUp.duration);
      break;

    case "paddleGrow":
      const originalHeight = playerHeight;
      player1.height *= 1.5;
      player2.height *= 1.5;
      setTimeout(() => {
        player1.height = originalHeight;
        player2.height = originalHeight;
      }, powerUp.duration);
      break;

    case "paddleShrink":
      const targetPlayer = ball.velocityX > 0 ? player2 : player1;
      targetPlayer.height *= 0.5;
      setTimeout(() => {
        targetPlayer.height = playerHeight;
      }, powerUp.duration);
      break;

    case "multiBall":
      const newBall1 = { ...ball, velocityY: ball.velocityY + 1 };
      const newBall2 = { ...ball, velocityY: ball.velocityY - 1 };
      balls.push(newBall1, newBall2);
      setTimeout(() => {
        balls = balls.slice(0, 1); // Keep only the original ball
      }, powerUp.duration);
      break;

    case "reverseControls":
      controlsReversed = true;
      setTimeout(() => {
        controlsReversed = false;
      }, powerUp.duration);
      break;
  }
}

function startGame() {
  gameStarted = true;
  gameMenu.classList.add("hidden");
  pauseButton.classList.remove("hidden"); // Show pause button

  // Reset everything to initial state
  player1Score = 0;
  player2Score = 0;
  powerUps = []; // Clear any existing power-ups
  balls = [ball]; // Reset to single ball

  // Reset paddle sizes
  player1.height = playerHeight;
  player2.height = playerHeight;

  // Reset ball speed and controls
  ball.velocityX = 2;
  ball.velocityY = 2;
  controlsReversed = false;

  resetGame(1);

  // Reset menu title for next game
  const menuTitle = document.querySelector(".menu-container h1");
  menuTitle.textContent = "CYBER PONG";
  menuTitle.classList.remove("game-over");

  // Reset start button text
  const startButton = document.getElementById("start-game");
  startButton.textContent = "Initialize Game";

  requestAnimationFrame(update);

  // Update controls visibility when starting the game
  updateControlsVisibility();
}

function toggleInstructions() {
  const instructions = document.getElementById("instructions");
  instructionsVisible = !instructionsVisible;

  if (instructionsVisible) {
    instructions.classList.remove("hidden");
  } else {
    instructions.classList.add("hidden");
  }
}

function endGame(winner) {
  gameStarted = false;
  gameMenu.classList.remove("hidden");

  const menuTitle = document.querySelector(".menu-container h1");
  // Update the winner text based on CPU mode
  if (cpuMode && winner === "Player 2") {
    menuTitle.textContent = "CPU DOMINATES";
  } else {
    menuTitle.textContent = `${winner} DOMINATES`;
  }
  menuTitle.classList.add("game-over");

  const startButton = document.getElementById("start-game");
  startButton.textContent = "Reboot System";

  // Reset everything for next game
  player1Score = 0;
  player2Score = 0;
  resetGame(1);
}

function togglePause() {
  if (!gameStarted) return;

  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? "▶️" : "⏸️";

  if (isPaused) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "pause-overlay";
    document.body.appendChild(overlay);

    // Create and show pause menu
    const pauseMenu = document.createElement("div");
    pauseMenu.id = "pause-menu";
    pauseMenu.className = "pause-menu";
    pauseMenu.innerHTML = `
      <h2>SYSTEM PAUSED</h2>
      <button id="resume-button">Resume Game</button>
      <button id="quit-button">Exit to Menu</button>
    `;
    document.body.appendChild(pauseMenu);

    // Add event listeners for pause menu buttons
    document
      .getElementById("resume-button")
      .addEventListener("click", togglePause);
    document
      .getElementById("quit-button")
      .addEventListener("click", quitToMenu);
  } else {
    // Remove pause menu and overlay
    const pauseMenu = document.getElementById("pause-menu");
    const overlay = document.querySelector(".pause-overlay");
    if (pauseMenu) {
      pauseMenu.remove();
    }
    if (overlay) {
      overlay.remove();
    }
    // Resume game loop
    requestAnimationFrame(update);
  }
}

function quitToMenu() {
  isPaused = false;
  gameStarted = false;

  // Remove pause menu and overlay
  const pauseMenu = document.getElementById("pause-menu");
  const overlay = document.querySelector(".pause-overlay");
  if (pauseMenu) {
    pauseMenu.remove();
  }
  if (overlay) {
    overlay.remove();
  }

  // Show main menu
  gameMenu.classList.remove("hidden");
  pauseButton.classList.add("hidden");

  // Reset everything
  player1Score = 0;
  player2Score = 0;
  resetGame(1);
}

// Add this new function for CPU movement
function updateCPU() {
  if (!cpuMode) return;

  // Find the active ball closest to the CPU paddle
  let targetBall = balls[0];
  let closestX = 0;

  for (let ball of balls) {
    if (ball.x > closestX) {
      closestX = ball.x;
      targetBall = ball;
    }
  }

  // Only react if ball is within prediction distance
  if (targetBall.x < boardWidth * currentDifficulty.maxPredictionDistance) {
    // Calculate predicted Y position with error margin
    const deltaX = player2.x - targetBall.x;
    const deltaY = targetBall.velocityY * (deltaX / targetBall.velocityX);
    let predictedY = targetBall.y + deltaY;

    // Add prediction error based on difficulty
    if (currentDifficulty.predictionError > 0) {
      const errorMargin = boardHeight * currentDifficulty.predictionError;
      predictedY += (Math.random() - 0.5) * errorMargin;
    }

    // Add reaction delay based on difficulty
    if (targetBall.x > boardWidth * currentDifficulty.reactionDelay) {
      // Move towards the predicted position
      const paddleCenter = player2.y + player2.height / 2;
      const targetY = predictedY - player2.height / 2;

      if (paddleCenter < targetY - 10) {
        player2.velocityY = currentDifficulty.speed;
      } else if (paddleCenter > targetY + 10) {
        player2.velocityY = -currentDifficulty.speed;
      } else {
        player2.velocityY = 0;
      }
    }
  }
}

// Add this new function to update controls visibility
function updateControlsVisibility() {
  const player2Controls = document.querySelector(
    ".control-section:nth-child(2)"
  );
  if (player2Controls) {
    if (cpuMode) {
      player2Controls.style.opacity = "0.5";
      player2Controls.style.pointerEvents = "none";
      player2Controls.querySelector("h3").textContent = "CPU";
    } else {
      player2Controls.style.opacity = "1";
      player2Controls.style.pointerEvents = "auto";
      player2Controls.querySelector("h3").textContent = "Player 2";
    }
  }
}
