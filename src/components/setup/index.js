// eslint-disable-next-line import/no-extraneous-dependencies
import PubSub from 'pubsub-js';
import './setup.scss';

const createTitle = () => {
  const title = document.createElement('div');
  title.className = 'setup-title';
  title.innerHTML = 'Place your Battleships';

  return title;
};

const handleMouseEnter = (row, col, isXAxis, isClick, length) => {
  const cell = [];
  for (let i = 0; i < length; i += 1) {
    if (isXAxis) {
      let newCol = parseInt(col, 10) + i;
      if (newCol > 9) newCol -= length;
      cell.push([row, newCol]);
    } else {
      let newRow = parseInt(row, 10) + i;
      if (newRow > 9) newRow -= length;
      cell.push([newRow, col]);
    }
  }

  const cellElements = [];

  cell.forEach((arr) => {
    const item = document.querySelector(`.cell[value = '${arr[0]},${arr[1]}']`);
    cellElements.push(item);
  });

  if (isClick && cellElements.some((item) => item.classList.contains('has-ship'))) return false;

  cellElements.forEach((item) => {
    const tempItem = item;
    tempItem.classList.add('ship-hover');
    if (isClick && item) {
      item.classList.add('has-ship');
    }
  });
  if (isClick) {
    PubSub.publish('next ship');
    return true;
  }

  return true;
};

const handleMouseLeave = () => {
  const allCells = document.querySelectorAll('.cell');
  allCells.forEach((item) => {
    const tempItem = item;
    tempItem.classList.remove('ship-hover');
  });
};

const createCell = (row, col) => {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.setAttribute('value', [row, col]);

  const ships = [5, 4, 3, 3, 2];
  PubSub.subscribe('next ship', () => {
    ships.shift();
    if (ships.length === 0) PubSub.publish('activate start button');
  });

  let isXAxis = true;
  PubSub.subscribe('axis', (msg, data) => {
    isXAxis = data;
  });

  cell.addEventListener('mouseenter', () => {
    const coords = cell.getAttribute('value').split(',');
    handleMouseEnter(coords[0], coords[1], isXAxis, false, ships[0]);
  });
  cell.addEventListener('mouseleave', () => handleMouseLeave());
  cell.addEventListener('click', () => {
    const coords = cell.getAttribute('value').split(',');
    if (handleMouseEnter(coords[0], coords[1], isXAxis, true, ships[0])) {
      PubSub.publish('add ship', [row, col, isXAxis]);
    }
  });

  return cell;
};

const createBoard = () => {
  const board = document.createElement('div');
  board.className = 'gameboard-placement';

  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      board.appendChild(createCell(i, j));
    }
  }

  return board;
};

const createStart = () => {
  const start = document.createElement('button');
  start.id = 'start';
  start.innerHTML = 'Start';
  start.disabled = true;
  const shipCoords = [];

  PubSub.subscribe('add ship', (msg, coords) => {
    shipCoords.push(coords);
  });

  PubSub.subscribe('activate start button', () => {
    start.disabled = false;
  });

  start.addEventListener('click', () => {
    PubSub.publish('start game', shipCoords);
  });

  return start;
};

const createRotate = () => {
  const rotate = document.createElement('button');
  rotate.id = 'rotate';
  rotate.innerHTML = 'Rotate';
  let isXAxis = true;
  PubSub.publish('axis', isXAxis);
  rotate.addEventListener('click', () => {
    if (isXAxis) isXAxis = false;
    else isXAxis = true;
    PubSub.publish('axis', isXAxis);
  });

  return rotate;
};

const createSetup = () => {
  const setup = document.createElement('div');
  setup.id = 'setup';

  setup.appendChild(createTitle());
  setup.appendChild(createRotate());
  setup.appendChild(createBoard());
  setup.appendChild(createStart());

  return setup;
};

export default createSetup;
