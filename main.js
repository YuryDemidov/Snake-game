'use strict';

(function () {

  const startButton = document.querySelector('.start-button');
  const wrapper = document.querySelector('.wrapper');
  const areaWidth = 800;
  const areaHeight = 400;
  const cellWidth = 20;
  const cellHeight = 20;
  const startingSnakeLength = 10;
  let snake = [];
  let gameSpeed = 300; // ms
  let movingDirection = 'right';
  let goal = 50;

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function createGameArea(width, height) {
    let gameArea = document.createElement('div');
    gameArea.classList.add('game-area');
    gameArea.style.width = width + 'px';
    gameArea.style.height = height + 'px';
    for (let i = 0; i < (width / cellWidth) * (height / cellHeight); i++){
      let gameAreaCell = document.createElement('span');
      gameAreaCell.classList.add('c--' + i, 'cell');
      gameAreaCell.style.width = cellWidth + 'px';
      gameAreaCell.style.height = cellHeight + 'px';
      gameArea.appendChild(gameAreaCell);
    }
    wrapper.appendChild(gameArea);
    const feedCollectedOutput = document.createElement('div');
    feedCollectedOutput.classList.add('feed-collected-output');
    feedCollectedOutput.textContent = 'Пищи съедено: 0';
    wrapper.appendChild(feedCollectedOutput);
  }

  function generateFeed() {
    let cells = document.querySelectorAll('.game-area span:not(.snake)');
    let newFeedCell = getRandomElement(cells);
    newFeedCell.classList.add('cell--feed');
  }

  function generateSnake(length) {
    let cells = document.querySelectorAll('.game-area span');
    let startingCell = getRandomElement(cells);
    let startingCellNumber = getCellNumber(startingCell);
    if ((startingCellNumber % (areaWidth / cellWidth)) < 15) {
      startingCellNumber += 15;
    } else if ((startingCellNumber % (areaWidth / cellWidth)) > 25) {
      startingCellNumber -= 10;
    }
    startingCell = cells[startingCellNumber];
    for (let i = startingCellNumber - length + 1 ; i <= startingCellNumber; i++) {
      cells[i].classList.add('snake');
      snake.push(cells[i]);
    }
  }

  function getCellNumber(cell) {
    let cellNumber = cell.classList[0].split('c--');
    return parseInt(cellNumber[1], 10);
  }

  function snakeIsGrowing() {
    let feed = document.querySelector('.cell--feed');
    let feedCollectedOutput = document.querySelector('.feed-collected-output');
    if (getCellNumber(snake[snake.length - 1]) === getCellNumber(feed)) {
      feed.classList.remove('cell--feed');
      generateFeed();
      gameSpeed *= 0.95;
      feedCollectedOutput.textContent = 'Пищи съедено: ' + (snake.length - startingSnakeLength + 1);
      return true;
    }
  }

  function snakeIsCrushing() {
    let snakeFirstCell = snake[snake.length - 1];
    for (let i = 0; i < snake.length - 3; i++) {
      if (snakeFirstCell === snake[i]) {
        return true;
      }
    }
  }

  function snakeMove(direction) {
    let cells = document.querySelectorAll('.game-area span');
    if (!snakeIsGrowing()){
      snake[0].classList.remove('snake');
      snake.shift();
    }
    switch (direction) {
      case 'up':
        cells[getCellNumber(snake[snake.length - 1]) - areaWidth / cellWidth].classList.add('snake');
        snake.push(cells[getCellNumber(snake[snake.length - 1]) - areaWidth / cellWidth]);
        break;
      case 'right':
        snake[snake.length - 1].nextElementSibling.classList.add('snake');
        snake.push(snake[snake.length - 1].nextElementSibling);
        break;
      case 'down':
        cells[getCellNumber(snake[snake.length - 1]) + areaWidth / cellWidth].classList.add('snake');
        snake.push(cells[getCellNumber(snake[snake.length - 1]) + areaWidth / cellWidth]);
        break;
      case 'left':
        snake[snake.length - 1].previousElementSibling.classList.add('snake');
        snake.push(snake[snake.length - 1].previousElementSibling);
        break;
      default:
        return;
    }
  }

  function gameTicking() {
    let timer = setTimeout(function tick() {
      window.addEventListener('keydown', keyboardHandler);
      snakeMove(movingDirection);
      timer = setTimeout(tick, gameSpeed);
      if (snakeIsCrushing()) {
        snake = [];
      }
      if (snake.length - startingSnakeLength === goal) {
        document.querySelector('.winning-window').classList.add('winning-window--show');
        snake = [];
      }
    }, gameSpeed);
  }

  function initGame() {
    createGameArea(areaWidth, areaHeight);
    generateSnake(startingSnakeLength);
    generateFeed();
    startButton.remove();
    gameTicking();
  }

  startButton.addEventListener('click', function() {
    initGame();
  });

  function keyboardHandler(evt) {
    window.removeEventListener('keydown', keyboardHandler);
    if (evt.defaultPrevented) {
      return;
    }
    switch (evt.code) {
      case 'Up': // IE/Edge
      case 'ArrowUp':
      case 'KeyW':
        if (movingDirection === 'down') {
          break;
        }
        movingDirection = 'up';
        break;
      case 'Right': // IE/Edge
      case 'ArrowRight':
      case 'KeyD':
        if (movingDirection === 'left') {
          break;
        }
        movingDirection = 'right';
        break;
      case 'Down': // IE/Edge
      case 'ArrowDown':
      case 'KeyS':
        if (movingDirection === 'up') {
          break;
        }
        movingDirection = 'down';
        break;
      case 'Left': // IE/Edge
      case 'ArrowLeft':
      case 'KeyA':
        if (movingDirection === 'right') {
          break;
        }
        movingDirection = 'left';
        break;
      default:
        return;
    }
    evt.preventDefault();
  }

})();
