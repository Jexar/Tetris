// DOM elements
const grid = document.querySelector(".grid");
const miniGrid = document.querySelector(".mini-grid");
const levelDisplay = document.querySelector("#level");
const startBtn = document.querySelector("#start-button");
const linesClearedDisplay = document.querySelector("#lines");

// Game variables
const width = 10;
const music = new Audio("tetris.mp3");
let nextRandom = 0;
let linesCleared = 0;
let level = 1;

// Main grid
for (let i = 0; i < 210; i++) {
  const div = document.createElement("div");
  grid.appendChild(div);
  if (i >= 200) {
    div.classList.add("taken");
    div.classList.add("bottom");
  }
}

// Convert the grid into an array
let squares = Array.from(document.querySelectorAll(".grid div"));

// Tetromino shapes
const jTetromino = [
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
  [1, width + 1, width * 2 + 1, 2],
];

const lTetromino = [
  [width, width + 1, width + 2, width * 2],
  [1, width + 1, width * 2 + 1, 0],
  [width + 2, width * 2, width * 2 + 1, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2 + 2],
];

const sTetromino = [
  [width * 2, width * 2 + 1, width + 1, width + 2],
  [0, width, width + 1, width * 2 + 1],
  [width * 2, width * 2 + 1, width + 1, width + 2],
  [0, width, width + 1, width * 2 + 1],
];

const zTetromino = [
  [width, width + 1, width * 2 + 1, width * 2 + 2],
  [2, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width * 2 + 1, width * 2 + 2],
  [2, width + 1, width + 2, width * 2 + 1],
];

const tTetromino = [
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
  [width * 2, width * 2 + 1, width * 2 + 2, width + 1],
  [1, width + 1, width * 2 + 1, width + 2],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
];

// Tetrominoes and their classes
const tetrominos = [
  jTetromino,
  lTetromino,
  sTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
];

const tetrominosClasses = [
  "jTetromino",
  "lTetromino",
  "sTetromino",
  "zTetromino",
  "tTetromino",
  "oTetromino",
  "iTetromino",
];

// Game state variables
let currentPosition = 4;
let currentRotation = 0;
let randomTetromino = Math.floor(Math.random() * tetrominos.length);
let currentShape = tetrominos[randomTetromino][currentRotation];

// Adds tetromino to the grid
function draw() {
  currentShape.forEach((index) => {
    squares[currentPosition + index].classList.add(
      tetrominosClasses[randomTetromino]
    );
  });
}

// Removes tetromino from the grid
function undraw() {
  currentShape.forEach((index) => {
    squares[currentPosition + index].classList.remove(
      tetrominosClasses[randomTetromino]
    );
  });
}

// Freezes tetromino if it hits a taken square
function freeze() {
  if (
    currentShape.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    currentShape.forEach((index) =>
      squares[currentPosition + index].classList.add("taken")
    );
    randomTetromino = nextRandom;
    nextRandom = Math.floor(Math.random() * tetrominos.length);
    currentPosition = 4;
    currentRotation = 0;
    currentShape = tetrominos[randomTetromino][currentRotation];
    displayMini();
    updateLinesCleared();
    draw();
  }
}

// Controls
let timerId = null;
startBtn.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    startBtn.innerHTML = "Start";
    document.removeEventListener("keydown", control);
    music.pause();
  } else {
    draw();
    timerId = setInterval(moveDown, 1000);
    startBtn.innerHTML = "Pause";
    document.addEventListener("keydown", control);
    music.play();
    displayMini();
  }
});

function control(e) {
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  } else if (e.key === "ArrowDown") {
    moveDown();
  } else if (e.key === "ArrowUp") {
    rotate();
  }
}

// Movement functions
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

function moveLeft() {
  undraw();
  const leftEdge = currentShape.some(
    (index) => (currentPosition + index) % width === 0
  );
  if (!leftEdge) currentPosition -= 1;
  if (
    currentShape.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition += 1;
  }
  draw();
}

function moveRight() {
  undraw();
  const rightEdge = currentShape.some(
    (index) => (currentPosition + index) % width === width - 1
  );
  if (!rightEdge) currentPosition += 1;
  if (
    currentShape.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition -= 1;
  }
  draw();
}

function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === currentShape.length) {
    currentRotation = 0;
  }
  currentShape = tetrominos[randomTetromino][currentRotation];

  const rightEdge = currentShape.some(
    (index) => (currentPosition + index) % width === width - 1
  );
  const leftEdge = currentShape.some(
    (index) => (currentPosition + index) % width === 0
  );

  if (
    (rightEdge && leftEdge) ||
    currentShape.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    if (currentRotation === 0) {
      currentRotation = currentShape.length - 1;
    } else {
      currentRotation--;
    }
    currentShape = tetrominos[randomTetromino][currentRotation];
  }

  draw();
}

// Mini-grid creation
for (let i = 0; i < 16; i++) {
  const div = document.createElement("div");
  miniGrid.appendChild(div);
}

const miniSquares = document.querySelectorAll(".mini-grid div");
const miniWidth = 4;
let miniIndex = 0;
const nextTetrominos = [
  [miniWidth, miniWidth + 1, miniWidth + 2, miniWidth * 2 + 2], // jTetromino
  [miniWidth, miniWidth + 1, miniWidth + 2, miniWidth * 2], // lTetromino
  [miniWidth * 2, miniWidth * 2 + 1, miniWidth + 1, miniWidth + 2], // sTetromino
  [miniWidth, miniWidth + 1, miniWidth * 2 + 1, miniWidth * 2 + 2], // zTetromino
  [miniWidth, miniWidth + 1, miniWidth + 2, miniWidth * 2 + 1], // tTetromino
  [miniWidth, miniWidth + 1, miniWidth * 2, miniWidth * 2 + 1], // oTetromino
  [miniWidth, miniWidth + 1, miniWidth + 2, miniWidth + 3], // iTetromino
];

function displayMini() {
  // Remove all tetromino classes from miniSquares
  tetrominosClasses.forEach((tetrominoClass) => {
    miniSquares.forEach((square) => {
      square.classList.remove(tetrominoClass);
    });
  });

  // Add class for the next tetromino
  nextTetrominos[nextRandom].forEach((index) => {
    miniSquares[miniIndex + index].classList.add(tetrominosClasses[nextRandom]);
  });
}

// Update lines cleared and level
function updateLinesCleared() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => squares[index].classList.contains("taken"))) {
      linesCleared++;
      linesClearedDisplay.innerText = "Lines: " + linesCleared;
      row.forEach((index) => {
        squares[index].className = "";
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((square) => grid.appendChild(square));
    }
  }
  switch (linesCleared) {
    case 10:
      level = 2;
      levelDisplay.innerText = "Level: " + level;
      clearInterval(timerId);
      timerId = setInterval(moveDown, 800);
      break;
    case 20:
      level = 3;
      levelDisplay.innerText = "Level: " + level;
      clearInterval(timerId);
      timerId = setInterval(moveDown, 600);
      break;
    case 30:
      level = 4;
      levelDisplay.innerText = "Level: " + level;
      clearInterval(timerId);
      timerId = setInterval(moveDown, 400);
      break;
    case 40:
      level = 5;
      levelDisplay.innerText = "Level: " + level;
      clearInterval(timerId);
      timerId = setInterval(moveDown, 200);
      break;
    case 50:
      level = 6;
      levelDisplay.innerText = "Level: " + level;
      clearInterval(timerId);
      timerId = setInterval(moveDown, 100);
      break;
  }
}
