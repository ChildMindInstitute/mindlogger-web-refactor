import { useEffect } from 'react';

import {
  publishSessionMessage,
  secureTokensStorage,
  SESSION_REQUEST_WINDOW_MS,
  subscribeSessionSync,
  useFeatureFlags,
} from '~/shared/utils';
import { FeatureFlag } from '~/shared/utils/types/featureFlags';

// A tab that loaded signed-out cannot see a sign-in that happens afterwards: its view of the
// encrypted store is a snapshot taken when the page loaded, and there is no way to re-read it. So
// it listens for a session being announced, and reloads, which is also the only way to reach the
// private key a submitted answer is encrypted with.
export const useSessionAdoption = () => {
  const { featureFlag } = useFeatureFlags();

  const isListening =
    featureFlag(FeatureFlag.EnableSessionKeepAlive, false) &&
    !secureTokensStorage.getTokens()?.refreshToken;

  useEffect(() => {
    if (!isListening) return;

    let reloadTimer: ReturnType<typeof setTimeout>;

    // Held back a beat rather than reloading outright: several announcements collapse into one
    // reload, and the signing-in tab's user slice has to reach local storage before this one reads
    // it back, or the reload lands on the login page it started from.
    const armReload = () => {
      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(() => window.location.reload(), SESSION_REQUEST_WINDOW_MS);
    };

    const unsubscribe = subscribeSessionSync((message) => {
      if (message.type !== 'SESSION_STATE') return;

      // No session id check: a tab with no session of its own has nothing to compare against, and
      // the announcement is by definition the one to join.
      armReload();
    });

    // Asked again on return, for the case where the browser had this tab frozen when the
    // announcement went out.
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      publishSessionMessage({ type: 'SESSION_REQUEST' });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(reloadTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
  }, [isListening]);
};
