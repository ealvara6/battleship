import Ship from './ship';

test('ship object is returned', () => {
  const ship = new Ship();
  expect(typeof ship).toBe('object');
});

test('ship length is returned', () => {
  const ship = new Ship(4);

  expect(ship.length).toBe(4);
});

test('returns boolean if ship has been sunk or not', () => {
  const ship = new Ship(3);

  expect(ship.isSunk()).toBeFalsy();

  const ship2 = new Ship(4);
  ship2.hit();
  ship2.hit();
  ship2.hit();
  ship2.hit();
  expect(ship2.isSunk()).toBeTruthy();

  const ship3 = new Ship(2);
  ship3.hit();
  expect(ship3.isSunk()).toBeFalsy();
});
