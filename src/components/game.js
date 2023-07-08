import PubSub from 'pubsub-js';
import Player from './player/player';
import Gameboard from './gameboard/gameboard';
import Ship from './ship/ship';

const getRandomCoord = (max) => Math.floor(Math.random() * max);

const populateBoard = (gameboard) => {
  const ships = [new Ship(2), new Ship(3), new Ship(3), new Ship(4), new Ship(5)];

  ships.forEach((ship) => {
    let legalPlacement = false;
    do {
      console.log('this was ran');
      const xCoord = getRandomCoord(gameboard.maxRow);
      const yCoord = getRandomCoord(gameboard.maxCol);
      if (gameboard.placeShip(xCoord, yCoord, ship, true)) legalPlacement = true;
    } while (!legalPlacement);
  });
};

const isGameOver = (player, ai) => {
  if (player.gameboard.allShipsSunk()) {
    PubSub.publish('game over', ai);
    return true;
  }
  if (ai.gameboard.allShipsSunk()) {
    PubSub.publish('game over', player);
    return true;
  }

  return false;
};

const game = () => {
  const player = new Player(true, new Gameboard(), 'player 1');

  // const playerXCoords = [];
  // const playerYCoords = [];
  // for (let i = 0; i < player.gameboard.maxRow; i += 1) {
  //   playerXCoords.push(getRandomCoord(player.gameboard.maxRow));
  //   playerYCoords.push(getRandomCoord(player.gameboard.maxCol));
  // }

  const ai = new Player(false, new Gameboard(), 'ai');
  // const aiXCoords = [];
  // const aiYCoords = [];

  // for (let i = 0; i < ai.gameboard.maxCol; i += 1) {
  //   aiXCoords.push(getRandomCoord(ai.gameboard.maxRow));
  //   aiYCoords.push(getRandomCoord(ai.gameboard.maxCol));
  // }

  populateBoard(player.gameboard);
  populateBoard(ai.gameboard);

  PubSub.publish('players', { player1: player, player2: ai });
};

const turn = (player, opponent, row, col) => {
  player.gameboard.receiveAttack(row, col);
  if (isGameOver(player, opponent)) return;
  let legalMove = false;
  do {
    const randomRow = getRandomCoord(player.gameboard.maxRow);
    const randomCol = getRandomCoord(player.gameboard.maxCol);
    legalMove = opponent.gameboard.receiveAttack(randomRow, randomCol);
  }
  while (!legalMove);
  PubSub.publish('player', opponent);
};

export {
  game,
  turn,
};
