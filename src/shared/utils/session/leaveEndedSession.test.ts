import { clearSessionEnded, consumeSessionEnded, leaveEndedSession } from './leaveEndedSession';
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

describe('consumeSessionEnded', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearSessionEnded();
  });

  it('reports the note left by the session that ended', () => {
    sessionStorage.setItem(SESSION_ENDED_KEY, 'true');

    expect(consumeSessionEnded()).toBe(true);
  });

  it('reports nothing on an ordinary boot', () => {
    expect(consumeSessionEnded()).toBe(false);
  });

  // Left behind, it turns away every later boot too, and only the banner's reload can free the tab.
  it('clears the note, so the next boot reads the browser as it stands', () => {
    sessionStorage.setItem(SESSION_ENDED_KEY, 'true');

    consumeSessionEnded();

    expect(sessionStorage.getItem(SESSION_ENDED_KEY)).toBeNull();
  });

  // Two callers read this. A boot that changed its mind halfway would take the tab into the session
  // it is meant to be offering a choice about.
  it('answers the same for the whole boot once the note is gone', () => {
    sessionStorage.setItem(SESSION_ENDED_KEY, 'true');

    consumeSessionEnded();

    expect(consumeSessionEnded()).toBe(true);
  });

  // Signing in answers the note, so the same boot stops being turned away.
  it('stops reporting the note once it has been answered', () => {
    sessionStorage.setItem(SESSION_ENDED_KEY, 'true');
    consumeSessionEnded();

    clearSessionEnded();

    expect(consumeSessionEnded()).toBe(false);
  });
});
