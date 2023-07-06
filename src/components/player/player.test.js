import Player from './player';

test('player object is created', () => {
  expect(typeof new Player()).toBe('object');
});

describe('type of player', () => {
  test('player is a human', () => {
    const player = new Player(true);
    expect(player.isHuman).toBeTruthy();
  });

  test('player is a computer', () => {
    const player = new Player(false);
    expect(player.isHuman).toBeFalsy();
  });
});
