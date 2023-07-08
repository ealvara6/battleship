import PubSub from 'pubsub-js';
import Player from './player/player';
import Gameboard from './gameboard/gameboard';
import Ship from './ship/ship';

const getRandomCoord = (max) => Math.floor(Math.random() * max);
const getRandomAxis = () => {
  const value = Math.floor(Math.random() * 2);
  return (value !== 0);
};

const populateBoard = (gameboard) => {
  const ships = [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2)];

  ships.forEach((ship) => {
    let legalPlacement = false;
    do {
      const xCoord = getRandomCoord(gameboard.maxRow);
      const yCoord = getRandomCoord(gameboard.maxCol);
      if (gameboard.placeShip(xCoord, yCoord, ship, getRandomAxis())) legalPlacement = true;
    } while (!legalPlacement);
  });
};

const isGameOver = (player, ai) => {
  if (player.gameboard.allShipsSunk()) {
    PubSub.publish('game over', ai);
  }
  if (ai.gameboard.allShipsSunk()) {
    PubSub.publish('game over', player);
  }
};

const game = () => {
  const player = new Player(true, new Gameboard(), 'player 1');
  const ai = new Player(false, new Gameboard(), 'ai');

  populateBoard(player.gameboard);
  populateBoard(ai.gameboard);

  PubSub.publish('players', { player1: player, player2: ai });
};

const turn = (player, opponent, row, col) => {
  player.gameboard.receiveAttack(row, col);
  let legalMove = false;
  do {
    const randomRow = getRandomCoord(player.gameboard.maxRow);
    const randomCol = getRandomCoord(player.gameboard.maxCol);
    legalMove = opponent.gameboard.receiveAttack(randomRow, randomCol);
  }
  while (!legalMove);
  PubSub.publish('player', opponent);
  isGameOver(player, opponent);
};

export {
  game,
  turn,
};
