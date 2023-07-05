const createBoard = () => {
  const col = 10;
  const row = 10;
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
    this.board = createBoard();
  }

  placeShip(row, col, ship, isXAxis) {
    const coords = [];

    for (let i = 0; i < ship.length; i += 1) {
      if (isXAxis) coords.push(this.board.find((cell) => cell.row === row && cell.col === col + i));
      else coords.push(this.board.find((cell) => cell.row === row + i && cell.col === col));
    }

    if (coords.some((coord) => !coord)) return false;
    if (coords.some((coord) => coord.ship)) return false;

    coords.forEach((coord) => {
      const tmpCoord = coord;
      tmpCoord.ship = ship;
    });
    return true;
  }

  recieveAttack(row, col) {
    const coords = this.board.find((cell) => cell.row === row && cell.col === col);

    if (coords.isHit || coords.isMiss) return null;

    if (!coords.ship) {
      coords.isMiss = true;
      return false;
    }

    coords.ship.hit();
    coords.isHit = true;

    return true;
  }
}

export default Gameboard;
