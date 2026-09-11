import { ACTIVE_SESSION_ID_KEY, LAST_ACTIVITY_AT_KEY } from './session.const';
import { localStorageService } from '../storage/localStorageService';

// Plain localStorage, not the encrypted store: neither value is a secret, and every tab has to be
// able to read the current one rather than the one it loaded with.
export const getLastActivityAt = (): number | null => {
  const stored = Number(localStorageService.getItem(LAST_ACTIVITY_AT_KEY));

  return Number.isFinite(stored) && stored > 0 ? stored : null;
};

export const setLastActivityAt = (at: number) =>
  localStorageService.setItem(LAST_ACTIVITY_AT_KEY, String(at));

// Which session the browser currently belongs to. A tab that slept through a sign-in holds a
// snapshot naming the session before it, and this is the only way it can tell.
export const getActiveSessionId = (): string | null =>
  localStorageService.getItem(ACTIVE_SESSION_ID_KEY) || null;

export const setActiveSessionId = (sessionId: string) =>
  localStorageService.setItem(ACTIVE_SESSION_ID_KEY, sessionId);

// Both go together: a session's clock and its identity end at the same moment.
export const clearSessionState = () => {
  localStorageService.removeItem(LAST_ACTIVITY_AT_KEY);
  localStorageService.removeItem(ACTIVE_SESSION_ID_KEY);
};
