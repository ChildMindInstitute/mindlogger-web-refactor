import { userModel } from '~/entities/user';
import {
  clearSessionState,
  getLastActivityAt,
  resolveSessionConfig,
  secureTokensStorage,
} from '~/shared/utils';

const PERSIST_KEY = 'persist:root';

// The slices a logout clears. defaultBanners is left behind, exactly as a logout leaves it.
const SESSION_SLICES = ['user', 'applets', 'autoCompletion'];

// A slice with no stored value rehydrates from its reducer's initial state, which is what the clear
// actions a logout dispatches return. Has to happen before the store is built: redux-persist reads
// this once on the way up and would otherwise put the dead session straight back.
const clearPersistedSlices = () => {
  const stored = localStorage.getItem(PERSIST_KEY);
  if (!stored) return;

  try {
    const persisted = JSON.parse(stored) as Record<string, string>;
    SESSION_SLICES.forEach((slice) => delete persisted[slice]);

    localStorage.setItem(PERSIST_KEY, JSON.stringify(persisted));
  } catch {
    // Unreadable, so there is nothing worth preserving in it.
    localStorage.removeItem(PERSIST_KEY);
  }
};

// Tokens live in local storage, so a session outlives its tab and closing the browser no longer
// ends one. Without this, a session left idle for days comes back looking signed in and only falls
// over on its first request.
export const clearStaleSession = () => {
  const lastActivityAt = getLastActivityAt();
  // Nothing has tracked this session, so there is no deadline to judge it against. Leave it to the
  // usual 401 path.
  if (!lastActivityAt) return;

  if (Date.now() - lastActivityAt < resolveSessionConfig().idleTimeoutMs) return;

  // Everything a logout clears, so a session that ends here ends the same way as one ended by hand.
  secureTokensStorage.clearTokens();
  userModel.secureUserPrivateKeyStorage.clearUserPrivateKey();
  clearPersistedSlices();
  clearSessionState();
};
