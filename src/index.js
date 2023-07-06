import PubSub from 'pubsub-js';
import './assets/styles/styles.scss';
import game from './components/game';

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

const createBoard = (playerName) => {
  const board = document.createElement('div');
  board.className = 'board';

  PubSub.subscribe(playerName, (msg, gameboard) => {
    gameboard.board.forEach((item) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (item.ship) cell.className = 'cell has-ship';
      else cell.className = 'cell no-ship';
      board.appendChild(cell);
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
