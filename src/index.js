// eslint-disable-next-line import/no-extraneous-dependencies
import PubSub from 'pubsub-js';
import './assets/styles/styles.scss';
import { game, turn } from './components/game';
import createSetup from './components/setup';

let isGameOver = false;

PubSub.subscribe('game over', () => {
  isGameOver = true;
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

const createCell = (player, opponent, item) => {
  const cell = document.createElement('div');
  cell.className = 'cell';
  if (item.ship && player.isHuman) cell.className = 'cell has-ship';
  else cell.className = 'cell no-ship';
  if (item.isHit) cell.classList.add('hit');
  if (item.isMiss) cell.classList.add('miss');

  if (!player.isHuman) {
    cell.addEventListener('click', () => {
      if (item.isHit || item.isMiss || isGameOver) return;
      turn(player, opponent, item.row, item.col);
      if (item.isHit) cell.classList.add('hit');
      if (item.isMiss) cell.classList.add('miss');
    });
  }

  return cell;
};

const createBoard = (player, opponent) => {
  const board = document.createElement('div');
  board.className = 'board';

  board.id = player.name;
  player.gameboard.board.forEach((item) => {
    board.appendChild(createCell(player, opponent, item));
  });

  return board;
};

PubSub.subscribe('player', (msg, player) => {
  const element = document.getElementById(player.name);
  if (element) {
    while (element.firstChild) element.removeChild(element.firstChild);
  }

  const parent = document.getElementById('player 1');
  player.gameboard.board.forEach((item) => {
    parent.appendChild(createCell(player, null, item));
  });
});

const createGameboard = (player, opponent) => {
  const gameBoard = document.createElement('div');
  gameBoard.className = 'gameboard';

  gameBoard.appendChild(createPlayerName(player.name.toUpperCase()));
  gameBoard.appendChild(createBoard(player, opponent));

  return gameBoard;
};

const component = () => {
  const container = document.createElement('div');
  container.id = 'container';
  const gameboards = document.createElement('div');
  gameboards.classList.add('gameboards');
  container.appendChild(createTitle());
  container.appendChild(gameboards);

  container.appendChild(createSetup());

  PubSub.subscribe('players', (msg, players) => {
    gameboards.appendChild(createGameboard(players.player1));
    gameboards.appendChild(createGameboard(players.player2, players.player1));
  });

  return container;
};

document.body.appendChild(component());

PubSub.subscribe('start game', (msg, shipCoords) => {
  const parent = document.getElementById('container');
  const setup = document.getElementById('setup');
  parent.removeChild(setup);
  game(shipCoords);
});

PubSub.subscribe('game over', (msg, player) => {
  const parent = document.getElementById('container');
  const element = document.createElement('div');
  element.className = 'game-over';
  element.innerHTML = `${player.name} has won!`;
  parent.appendChild(element);

  const retryButton = document.createElement('button');
  retryButton.id = 'retry';
  retryButton.innerHTML = 'Retry';
  parent.appendChild(retryButton);

  retryButton.addEventListener('click', () => {
    while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
    isGameOver = false;
    document.body.appendChild(component());
  });
});
