import { leaveEndedSession } from './leaveEndedSession';
import { SESSION_ENDED_KEY } from './session.const';
import {
  getActiveSessionId,
  getLastActivityAt,
  setActiveSessionId,
  setLastActivityAt,
} from './sessionStore';

const reload = vi.fn();

describe('leaveEndedSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
    vi.stubGlobal('location', { ...window.location, reload });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('leaves a note for the boot on the way back in, then reloads', () => {
    leaveEndedSession();

    expect(sessionStorage.getItem(SESSION_ENDED_KEY)).toBe('true');
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('drops what belonged to the session that ended', () => {
    sessionStorage.setItem('answers-in-progress', 'something');

    leaveEndedSession();

    expect(sessionStorage.getItem('answers-in-progress')).toBeNull();
  });

  // The live session's clock and identity, which the tabs still in it are reading. Clearing them
  // is exactly the harm this function exists to avoid.
  it('leaves the running session its clock and its identity', () => {
    setLastActivityAt(Date.now());
    setActiveSessionId('family-2');

    leaveEndedSession();

    expect(getLastActivityAt()).not.toBeNull();
    expect(getActiveSessionId()).toBe('family-2');
  });
});
