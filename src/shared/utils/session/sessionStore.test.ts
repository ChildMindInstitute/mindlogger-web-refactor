import { LAST_ACTIVITY_AT_KEY } from './session.const';
import { clearSessionState, getLastActivityAt, setLastActivityAt } from './sessionStore';

describe('sessionStore', () => {
  beforeEach(() => localStorage.clear());

  it('writes the timestamp somewhere every tab can read it', () => {
    setLastActivityAt(1893456000000);

    expect(localStorage.getItem(LAST_ACTIVITY_AT_KEY)).toBe('1893456000000');
    expect(getLastActivityAt()).toBe(1893456000000);
  });

  it.each([
    ['nothing has been written', null],
    ['the value is not a number', 'yesterday'],
    ['the value is zero', '0'],
  ])('returns null when %s', (_label, stored) => {
    if (stored !== null) localStorage.setItem(LAST_ACTIVITY_AT_KEY, stored);

    expect(getLastActivityAt()).toBeNull();
  });

  it('clears the timestamp, which is what marks a session as ended', () => {
    setLastActivityAt(Date.now());
    clearSessionState();

    expect(getLastActivityAt()).toBeNull();
  });
});
