import PubSub from 'pubsub-js';
import Player from './player/player';
import Gameboard from './gameboard/gameboard';
import Ship from './ship/ship';

const populateBoard = (gameboard, xCoords, yCoords) => {
  const ships = [new Ship(2), new Ship(3), new Ship(3), new Ship(4), new Ship(5)];

  ships.forEach((ship) => {
    try {
      if (!gameboard.placeShip(xCoords.shift(), yCoords.shift(), ship, true)) {
        throw new Error('Incorrect ship placement');
      }
    } catch (e) {
      console.log(e);
    }
  });
};

const getRandomCoord = (max) => Math.floor(Math.random() * max);

const isGameOver = (player, ai) => {
  if (player.gameboard.allShipsSunk()) {
    PubSub.publish('game over', ai);
    return true;
  }
  if (ai.gameboard.allShipsSunk()) {
    PubSub.publish('game over', player);
  }

  return false;
};

const game = () => {
  const player = new Player(true, new Gameboard(), 'player 1');
  const playerXCoords = [0, 3, 6, 8, 9];
  const playerYCoords = [0, 3, 6, 3, 3];

  const ai = new Player(false, new Gameboard(), 'ai');
  const aiXCoords = [0, 5, 9, 0, 4];
  const aiYCoords = [0, 5, 6, 4, 5];

  populateBoard(player.gameboard, playerXCoords, playerYCoords);
  populateBoard(ai.gameboard, aiXCoords, aiYCoords);

  PubSub.publish('player 1', player);
  PubSub.publish('ai', ai);

  PubSub.subscribe('ai turn', () => {
    if (isGameOver(player, ai)) return;
    let legalMove = false;
    do {
      const row = getRandomCoord(player.gameboard.maxRow);
      const col = getRandomCoord(player.gameboard.maxCol);
      legalMove = player.gameboard.receiveAttack(row, col);
    }
    while (!legalMove);
    PubSub.publish('player 1', player);
  });
};

export default game;
