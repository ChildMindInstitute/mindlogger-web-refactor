import { formatCountdown } from './sessionCountdown';

describe('formatCountdown', () => {
  it.each([
    [300000, '5:00'],
    [90000, '1:30'],
    [60000, '1:00'],
    [7000, '0:07'],
    [0, '0:00'],
  ])('renders %i ms as %s', (ms, expected) => {
    expect(formatCountdown(ms)).toBe(expected);
  });

  // A tick landing a hair late must not read 0:00 while the session is still alive.
  it('rounds a part second up', () => {
    expect(formatCountdown(6001)).toBe('0:07');
    expect(formatCountdown(1)).toBe('0:01');
  });

  it('never renders a negative countdown', () => {
    expect(formatCountdown(-5000)).toBe('0:00');
  });
});
