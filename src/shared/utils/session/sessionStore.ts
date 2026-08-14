import { LAST_ACTIVITY_AT_KEY } from './session.const';
import { localStorageService } from '../storage/localStorageService';

// Plain localStorage, not the encrypted store: a timestamp is not a secret, and every tab has to be
// able to read the current value rather than the one it loaded with.
export const getLastActivityAt = (): number | null => {
  const stored = Number(localStorageService.getItem(LAST_ACTIVITY_AT_KEY));

  return Number.isFinite(stored) && stored > 0 ? stored : null;
};

export const setLastActivityAt = (at: number) =>
  localStorageService.setItem(LAST_ACTIVITY_AT_KEY, String(at));

export const clearSessionState = () => localStorageService.removeItem(LAST_ACTIVITY_AT_KEY);
