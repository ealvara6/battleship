import PubSub from 'pubsub-js';
import './assets/styles/styles.scss';
import game from './components/game';

PubSub.subscribe('game over', (msg, player) => {
  const parent = document.getElementById('container');
  const element = document.createElement('div');
  element.className = 'game-over';
  element.innerHTML = `${player.name} has won!`;

  parent.appendChild(element);
});

const createTitle = () => {
  const title = document.createElement('div');
  title.id = 'title';
  title.innerHTML = 'BATTLESHIP';

  return title;
};

const createPlayerName = (playerName) => {
  const name = document.createElement('div');
  name.className = 'name';
  name.innerHTML = playerName;

  return name;
};

const createCell = (player, item) => {
  const cell = document.createElement('div');
  cell.className = 'cell';
  if (item.ship) cell.className = 'cell has-ship';
  // else cell.className = 'cell no-ship';
  if (item.isHit) cell.classList.add('hit');
  if (item.isMiss) cell.classList.add('miss');

  if (!player.isHuman) {
    cell.addEventListener('click', () => {
      if (item.isHit || item.isMiss) return;
      player.gameboard.receiveAttack(item.row, item.col);
      if (item.isHit) cell.classList.add('hit');
      if (item.isMiss) cell.classList.add('miss');

      PubSub.publish('ai turn');
    });
  }

  return cell;
};

const createBoard = (playerName) => {
  const board = document.createElement('div');
  board.className = 'board';

  PubSub.subscribe(playerName, (msg, player) => {
    const element = document.getElementById(playerName);
    if (element) {
      while (element.firstChild) element.removeChild(element.firstChild);
    }

    board.id = playerName;
    player.gameboard.board.forEach((item) => {
      board.appendChild(createCell(player, item));
    });
  });

  return board;
};

const createGameboard = (playerName) => {
  const gameBoard = document.createElement('div');
  gameBoard.className = 'gameboard';

  gameBoard.appendChild(createPlayerName(playerName.toUpperCase()));
  gameBoard.appendChild(createBoard(playerName));

  return gameBoard;
};

const component = () => {
  const container = document.createElement('div');
  container.id = 'container';

  container.appendChild(createTitle());
  container.appendChild(createGameboard('player 1'));
  container.appendChild(createGameboard('ai'));

  return container;
};

document.body.appendChild(component());
game();
