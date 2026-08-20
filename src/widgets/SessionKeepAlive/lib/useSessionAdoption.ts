import { useEffect } from 'react';

import ROUTES from '~/shared/constants/routes';
import {
  getLastActivityAt,
  publishSessionMessage,
  RELOAD_ATTEMPTED_KEY,
  resolveSessionConfig,
  secureTokensStorage,
  SESSION_REQUEST_WINDOW_MS,
  subscribeSessionSync,
} from '~/shared/utils';

// A tab that loaded signed-out cannot see a sign-in that happens afterwards: its view of the
// encrypted store is a snapshot taken when the page loaded, and there is no way to re-read it. So
// it listens for a session being announced, and reloads, which is also the only way to reach the
// private key a submitted answer is encrypted with.
export const useSessionAdoption = () => {
  const isListening = !secureTokensStorage.getTokens()?.refreshToken;

  useEffect(() => {
    if (!isListening) {
      // This tab holds a session, so a later gap is free to reload its way into the next one.
      sessionStorage.removeItem(RELOAD_ATTEMPTED_KEY);

      return;
    }

    let reloadTimer: ReturnType<typeof setTimeout>;

    const reloadIntoSession = () => {
      const lastActivityAt = getLastActivityAt();
      // Nothing has been tracked, so no session was left behind to reload into.
      if (!lastActivityAt) return;

      // Past its deadline the session is over anyway, and the boot check clears it. Reloading
      // would only land on the same login page.
      if (Date.now() - lastActivityAt >= resolveSessionConfig().idleTimeoutMs) return;

      // Survives the reload it is about to cause, so a session this tab cannot read even after
      // reloading is attempted once rather than forever. Cleared above once the tab has one.
      if (sessionStorage.getItem(RELOAD_ATTEMPTED_KEY)) return;
      sessionStorage.setItem(RELOAD_ATTEMPTED_KEY, 'true');

      // The login route renders its form to signed-in tabs too, so reloading in place would land
      // back on it holding a session it cannot show. Anywhere else reloads where it stands.
      if (window.location.pathname === ROUTES.login.path) {
        window.location.replace('/');

        return;
      }

      window.location.reload();
    };

    // Held back a beat rather than reloading outright: several announcements collapse into one
    // reload, and the signing-in tab's user slice has to reach local storage before this one reads
    // it back, or the reload lands on the login page it started from.
    const armReload = () => {
      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(reloadIntoSession, SESSION_REQUEST_WINDOW_MS);
    };

    const unsubscribe = subscribeSessionSync((message) => {
      if (message.type !== 'SESSION_STATE') return;

      // No session id check: a tab with no session of its own has nothing to compare against, and
      // the announcement is by definition the one to join.
      armReload();
    });

    // Asked again on return, for the case where the browser had this tab frozen when the
    // announcement went out. Nobody answering is itself an answer: the last tab holding the
    // session has been closed, and reloading is the only way back into it.
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      publishSessionMessage({ type: 'SESSION_REQUEST' });
      armReload();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(reloadTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
  }, [isListening]);
};
