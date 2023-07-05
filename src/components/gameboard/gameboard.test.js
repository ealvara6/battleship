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
    gameboard.placeShip(9, 0, ship, true);

    // expect ship to occupy cell [9, 0]
    expect(gameboard.board.find((cell) => cell.row === 9 && cell.col === 0).ship).toBe(ship);
    // expect ship to occupy cell [9, 1]
    expect(gameboard.board.find((cell) => cell.row === 9 && cell.col === 1).ship).toBe(ship);
    // expect ship to occupy cell [9, 2]
    expect(gameboard.board.find((cell) => cell.row === 9 && cell.col === 2).ship).toBe(ship);
  });

  test('ship occupies bottom vertical cells based on length', () => {
    const ship = new Ship(2);
    gameboard.placeShip(3, 5, ship, false);
    expect(gameboard.board.find((cell) => cell.row === 3 && cell.col === 5).ship).toBe(ship);
    expect(gameboard.board.find((cell) => cell.row === 4 && cell.col === 5).ship).toBe(ship);
  });
});

describe('gameboard recieves an attack', () => {
  const gameboard = new Gameboard();
  const ship = new Ship(4);
  gameboard.placeShip(0, 0, ship, true);

  describe('attack hits a ship', () => {
    test('ship is hit', () => {
      expect(gameboard.recieveAttack(0, 0)).toBeTruthy();
    });

    test('ship hit function called', () => {
      expect(ship.hits).toBe(1);
    });

    test('hit coordinates are logged', () => {
      expect(gameboard.board.find((cell) => cell.row === 0 && cell.col === 0).isHit).toBeTruthy();
    });
  });

  describe('missed attack', () => {
    test('attack misses', () => {
      expect(gameboard.recieveAttack(5, 5)).toBeFalsy();
    });

    test('missed coordinates are logged', () => {
      expect(gameboard.board.find((cell) => cell.row === 5 && cell.col === 5).isMiss).toBeTruthy();
    });
  });

  test('same coordinate is attacked', () => {
    expect(gameboard.recieveAttack(0, 0)).toBe(null);
    expect(gameboard.recieveAttack(5, 5)).toBe(null);
  });
});
