import Gameboard from './gameboard';
import Ship from '../ship/ship';

test('return a gameboard object', () => {
  const gameboard = new Gameboard();

  expect(typeof gameboard).toBe('object');
});

describe('place ship on board', () => {
  const gameboard = new Gameboard();

  test('coords are on the game board', () => {
    expect(gameboard.placeShip(0, 1, new Ship(3))).toBeTruthy();
  });

  test('coords are not on the game board', () => {
    expect(gameboard.placeShip(11, 1, new Ship(3))).toBeFalsy();
    expect(gameboard.placeShip(9, 9, new Ship(3))).toBeFalsy();
  });

  test('a ship is already occupying coords', () => {
    expect(gameboard.placeShip(0, 1, new Ship(3))).toBeFalsy();
  });

  test('ship occupies right horizontal cells based on length', () => {
    const ship = new Ship(3);
    gameboard.placeShip(9, 0, ship);

    // expect ship to occupy cell [9, 0]
    expect(gameboard.board.find((cell) => cell.row === 9 && cell.col === 0).ship).toBe(ship);
    // expect ship to occupy cell [9, 1]
    expect(gameboard.board.find((cell) => cell.row === 9 && cell.col === 1).ship).toBe(ship);
    // expect ship to occupy cell [9, 2]
    expect(gameboard.board.find((cell) => cell.row === 9 && cell.col === 2).ship).toBe(ship);
  });
});
