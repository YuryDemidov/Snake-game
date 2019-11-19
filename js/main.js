'use strict';

(function () {

  const startButtons = document.querySelectorAll('.start-button');
  const wrapper = document.querySelector('.wrapper');
  const areaWidth = 800;
  const areaHeight = 400;
  const cellWidth = 20;
  const cellHeight = 20;
  const cellsPerRow = areaWidth / cellWidth;
  const cellsPerColumn = areaHeight / cellHeight;
  const cellsTotal = cellsPerRow * cellsPerColumn;
  const startingSnakeLength = 10;
  let randomWalls = [];
  let snake = [];
  let gameSpeed; // ms
  let movingDirection; // 'up' — u; 'right' — r; 'down' — d; 'left' — l
  let goal = 40;
  document.querySelector('.goal').textContent = goal;

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomVector(x) {
    for (let i = 0; i < x; i++) {
      randomWalls.push(Math.round(Math.random()));
    }
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
    if ((startingCellNumber % (cellsPerRow)) < 15) {
      startingCellNumber += 15;
    } else if ((startingCellNumber % (cellsPerRow)) > 25) {
      startingCellNumber -= 10;
    }
    startingCell = cells[startingCellNumber];
    for (let i = startingCellNumber - length + 1 ; i <= startingCellNumber; i++) {
      cells[i].classList.add('snake', 'snake--horizontal');
      snake.push(cells[i]);
    }
  }

  function getCellNumber(cell) {
    let cellNumber = cell.classList[0].split('c--');
    return parseInt(cellNumber[1], 10);
  }

  function snakeIsGrowing() {
    let feed = document.querySelector('.cell--feed');
    if (getCellNumber(snake[snake.length - 1]) === getCellNumber(feed)) {
      feed.classList.remove('cell--feed');
      generateFeed();
      gameSpeed *= 0.94; // Speed increases with every feed eating
      let feedCollectedOutput = document.querySelector('.feed-collected-output');
      feedCollectedOutput.textContent = 'Пищи съедено: ' + (snake.length - startingSnakeLength + 1);
      return true;
    }
  }

  function snakeIsAlive() {
    let cells = document.querySelectorAll('.game-area span');
    let snakeFirstCell = snake[snake.length - 1];
    let firstCellNumber = getCellNumber(snakeFirstCell);
    if (firstCellNumber - cellsPerRow < 0 && movingDirection === 'up' && !randomWalls[0]) {
      return false;
    } else if (firstCellNumber - cellsPerRow < 0 && movingDirection === 'up') {
      return cells[cellsTotal - cellsPerRow + firstCellNumber];
    }
    if ((firstCellNumber + 1) % cellsPerRow === 0 && movingDirection === 'right' && !randomWalls[1]) {
      return false;
    } else if ((firstCellNumber + 1) % cellsPerRow === 0 && movingDirection === 'right') {
      return cells[firstCellNumber - cellsPerRow];
    }
    if (firstCellNumber + cellsPerRow >= cellsTotal && movingDirection === 'down' && !randomWalls[2]) {
      return false;
    } else if (firstCellNumber + cellsPerRow >= cellsTotal && movingDirection === 'down') {
      return cells[firstCellNumber - cellsTotal + cellsPerRow];
    }
    if (firstCellNumber % cellsPerRow === 0 && movingDirection === 'left' && !randomWalls[3]) {
      return false;
    } else if (firstCellNumber % cellsPerRow === 0 && movingDirection === 'left') {
      return cells[firstCellNumber + cellsPerRow];
    }
    for (let i = 0; i < snake.length - 1; i++) {
      if (snakeFirstCell === snake[i]) {
        return false;
      }
    }
    return true;
  }

  function snakeMove(direction) {
    let cells = document.querySelectorAll('.game-area span');
    let snakeFirstCell = snake[snake.length - 1];
    let firstCellNumber = getCellNumber(snakeFirstCell);
    snakeFirstCell.classList.remove('snake--u-head', 'snake--r-head', 'snake--d-head', 'snake--l-head');
    if (!snakeIsGrowing() && snakeFirstCell !== snake[0]){
      let tempCellClass = snake[0].classList[0];
      snake[0].className = tempCellClass + ' cell';
      snake.shift();
    }
    let firstCell = snakeIsAlive();
    if (firstCell !== undefined && typeof firstCell !== 'boolean') {
      snakeFirstCell = firstCell;
      firstCellNumber = getCellNumber(snakeFirstCell);
    }
    switch (direction) {
      case 'up':
        if (!firstCell) {
          wrapper.querySelector('.window--lose').classList.add('window--show');
          snake = [];
          window.timer = null;
          break;
        }
        if (firstCell === true) {
          cells[firstCellNumber - cellsPerRow].classList.add('snake', 'snake--vertical', 'snake--u-head');
          snake.push(cells[firstCellNumber - cellsPerRow]);
          break;
        }
        if (typeof firstCell !== 'boolean') {
          cells[firstCellNumber].classList.add('snake', 'snake--vertical', 'snake--u-head');
          snake.push(cells[firstCellNumber]);
          colorizeWall(direction);
          break;
        }
      case 'right':
        if (firstCell === undefined) {
          cells[0].classList.add('snake', 'snake--horizontal', 'snake--r-head');
          snake.push(cells[0]);
          colorizeWall(direction);
          break;
        } else if (!firstCell) {
          wrapper.querySelector('.window--lose').classList.add('window--show');
          snake = [];
          window.timer = null;
          break;
        }
        if (firstCell === true) {
          cells[firstCellNumber + 1].classList.add('snake', 'snake--horizontal', 'snake--r-head');
          snake.push(cells[firstCellNumber + 1]);
          break;
        }
        if (typeof firstCell !== 'boolean') {
          snakeFirstCell.nextElementSibling.classList.add('snake', 'snake--horizontal', 'snake--r-head');
          snake.push(snakeFirstCell.nextElementSibling);
          colorizeWall(direction);
          break;
        }
      case 'down':
        if (!firstCell) {
          wrapper.querySelector('.window--lose').classList.add('window--show');
          snake = [];
          window.timer = null;
          break;
        }
        if (firstCell === true) {
          cells[firstCellNumber + cellsPerRow].classList.add('snake', 'snake--vertical', 'snake--d-head');
          snake.push(cells[firstCellNumber + cellsPerRow]);
          break;
        }
        if (typeof firstCell !== 'boolean') {
          cells[firstCellNumber].classList.add('snake', 'snake--vertical', 'snake--d-head');
          snake.push(cells[firstCellNumber]);
          colorizeWall(direction);
          break;
        }
      case 'left':
        if (firstCell === undefined) {
          cells[cells.length - 1].classList.add('snake', 'snake--horizontal', 'snake--l-head');
          snake.push(cells[cells.length - 1]);
          colorizeWall(direction);
          break;
        } else if (!firstCell) {
          wrapper.querySelector('.window--lose').classList.add('window--show');
          snake = [];
          window.timer = null;
          break;
        }
        if (firstCell === true) {
          cells[firstCellNumber - 1].classList.add('snake', 'snake--horizontal', 'snake--l-head');
          snake.push(cells[firstCellNumber - 1]);
          break;
        }
        if (typeof firstCell !== 'boolean') {
          snakeFirstCell.previousElementSibling.classList.add('snake', 'snake--horizontal', 'snake--l-head');
          snake.push(snakeFirstCell.previousElementSibling);
          colorizeWall(direction);
          break;
        }
      default:
        return;
    }
    if (window.timer === null) {
      return false;
    }
  }

  function colorizeWall(wall) {
    let borderParameters = '15px ridge lightblue';
    switch (wall) {
      case 'up':
        wrapper.querySelector('.game-area').style.borderTop = borderParameters;
        break;
      case 'right':
        wrapper.querySelector('.game-area').style.borderRight = borderParameters;
        break;
      case 'down':
        wrapper.querySelector('.game-area').style.borderBottom = borderParameters;
        break;
      case 'left':
        wrapper.querySelector('.game-area').style.borderLeft = borderParameters;
        break;
    }
  }

  function gameTicking() {
    window.timer = setTimeout(function tick() {
      window.addEventListener('keydown', keyboardHandler);
      let moving = snakeMove(movingDirection);
      window.timer = setTimeout(tick, gameSpeed);
      if (moving === false) {
        clearTimeout(window.timer);
      }
      if (snake.length - startingSnakeLength === goal) {
        wrapper.querySelector('.window--win').classList.add('window--show');
        snake = [];
        clearTimeout(window.timer);
        window.removeEventListener('keydown', keyboardHandler);
      }
    }, gameSpeed);
  }

  function resetGameArea() {
    if (wrapper.querySelector('.game-area')) {
      wrapper.querySelector('.window--win').classList.remove('window--show');
      wrapper.querySelector('.window--lose').classList.remove('window--show');
      wrapper.querySelector('.feed-collected-output').remove();
      wrapper.querySelector('.game-area').remove();
    }
  }

  function initGame() {
    movingDirection = 'right';
    gameSpeed = 300;
    randomWalls = [];
    createGameArea(areaWidth, areaHeight);
    generateSnake(startingSnakeLength);
    generateFeed();
    getRandomVector(4);
    startButtons[0].remove();
    document.querySelector('.text--additional').classList.add('hidden');
    gameTicking();
  }

  for (let i = 0; i < startButtons.length; i++) {
    startButtons[i].addEventListener('click', function() {
      resetGameArea();
      initGame();
    });
  }

  function keyboardHandler(evt) {
    window.removeEventListener('keydown', keyboardHandler);
    if (evt.defaultPrevented) {
      return;
    }
    switch (evt.key) {
      case 'Up': // IE/Edge
      case 'ArrowUp':
      case 'w':
      case 'ц':
        if (movingDirection === 'down' || movingDirection === 'up') {
          return;
        }
        if (movingDirection === 'right') {
          snake[snake.length - 1].classList.add('snake--bended', 'snake--rtu-bend');
        } else if (movingDirection === 'left') {
          snake[snake.length - 1].classList.add('snake--bended', 'snake--ltu-bend');
        }
        movingDirection = 'up';
        return;
      case 'Right': // IE/Edge
      case 'ArrowRight':
      case 'd':
      case 'в':
        if (movingDirection === 'left' || movingDirection === 'right') {
          return;
        }
        if (movingDirection === 'up') {
          snake[snake.length - 1].classList.add('snake--bended', 'snake--utr-bend');
        } else if (movingDirection === 'down') {
          snake[snake.length - 1].classList.add('snake--bended', 'snake--dtr-bend');
        }
        movingDirection = 'right';
        return;
      case 'Down': // IE/Edge
      case 'ArrowDown':
      case 's':
      case 'ы':
        if (movingDirection === 'up' || movingDirection === 'down') {
          return;
        }
        if (movingDirection === 'right') {
          snake[snake.length - 1].classList.add('snake--bended', 'snake--rtd-bend');
        } else if (movingDirection === 'left') {
          snake[snake.length - 1].classList.add('snake--bended', 'snake--ltd-bend');
        }
        movingDirection = 'down';
        return;
      case 'Left': // IE/Edge
      case 'ArrowLeft':
      case 'a':
      case 'ф':
        if (movingDirection === 'right' || movingDirection === 'left') {
          return;
        }
        if (movingDirection === 'up') {
          snake[snake.length - 1].classList.add('snake--bended', 'snake--utl-bend');
        } else if (movingDirection === 'down') {
          snake[snake.length - 1].classList.add('snake--bended', 'snake--dtl-bend');
        }
        movingDirection = 'left';
        return;
      default:
        return;
    }
    evt.preventDefault();
  }

})();
