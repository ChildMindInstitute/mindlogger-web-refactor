import { ACTIVE_SESSION_ID_KEY, LAST_ACTIVITY_AT_KEY } from './session.const';
import {
  clearSessionState,
  getActiveSessionId,
  getLastActivityAt,
  setActiveSessionId,
  setLastActivityAt,
} from './sessionStore';

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

  it('writes the session id somewhere every tab can read it', () => {
    setActiveSessionId('family-1');

    expect(localStorage.getItem(ACTIVE_SESSION_ID_KEY)).toBe('family-1');
    expect(getActiveSessionId()).toBe('family-1');
  });

  it('returns null for a session id nobody has written', () => {
    expect(getActiveSessionId()).toBeNull();
  });

  // Otherwise an empty string would compare unequal to every real id and read as a mismatch.
  it('treats an empty session id as nothing recorded', () => {
    localStorage.setItem(ACTIVE_SESSION_ID_KEY, '');

    expect(getActiveSessionId()).toBeNull();
  });

  // They have to go together, or a check reading one would disagree with a check reading the other.
  it('clears the session id alongside the timestamp', () => {
    setLastActivityAt(Date.now());
    setActiveSessionId('family-1');
    clearSessionState();

    expect(getActiveSessionId()).toBeNull();
  });
});
