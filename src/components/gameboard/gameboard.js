const createBoard = (col, row) => {
  const board = [];

  for (let i = 0; i < col; i += 1) {
    for (let j = 0; j < row; j += 1) {
      board.push({
        col: j,
        row: i,
        ship: null,
        isHit: false,
        isMiss: false,
      });
    }
  }

  return board;
};

class Gameboard {
  constructor() {
    this.maxCol = 10;
    this.maxRow = 10;
    this.board = createBoard(this.maxCol, this.maxRow);
    this.ships = [];
  }

  placeShip(row, col, ship, isXAxis) {
    const coords = [];

    for (let i = 0; i < ship.length; i += 1) {
      if (isXAxis) coords.push(this.board.find((cell) => cell.row === row && cell.col === col + i));
      else coords.push(this.board.find((cell) => cell.row === row + i && cell.col === col));
    }
    console.log(coords);

    if (coords.some((coord) => !coord)) return false;
    if (coords.some((coord) => coord.ship)) return false;

    this.ships.push(ship);
    coords.forEach((coord) => {
      const tmpCoord = coord;
      tmpCoord.ship = ship;
    });
    return true;
  }

  receiveAttack(row, col) {
    const coords = this.board.find((cell) => cell.row === row && cell.col === col);

    if (coords.isHit || coords.isMiss) return false;

    if (!coords.ship) {
      coords.isMiss = true;
    } else {
      coords.ship.hit();
      coords.isHit = true;
    }

    return true;
  }

  allShipsSunk() {
    if (this.ships.every((ship) => ship.isSunk())) return true;

    return false;
  }
}

export default Gameboard;
