import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { BannerOrder, actions } from '~/entities/banner/model';
import { ROUTES } from '~/shared/constants';
import {
  getLastActivityAt,
  matchPaths,
  publishSessionMessage,
  resolveSessionConfig,
  secureTokensStorage,
  SESSION_ELSEWHERE_KEY,
  SESSION_REQUEST_WINDOW_MS,
  subscribeSessionSync,
  useAppDispatch,
} from '~/shared/utils';

// Whoever is filling in a public-link activity has no account and never signed in, so somebody
// else's sign-in in this browser is not about them. Their tab stays out of this entirely.
const EXCLUDED_ROUTES = [ROUTES.publicSurvey.path, ROUTES.publicAutoCompletion.path];

// A tab that loaded signed-out cannot see a sign-in that happens afterwards: its view of the
// encrypted store is a snapshot taken when the page loaded, and there is no way to re-read it. So
// it listens for a session being announced, and asks again whenever it returns to focus, for the
// case where the browser had frozen it when the announcement went out. What it never does is let
// itself in: it says a session is running, and the user decides whether to join it.
export const useSessionAdoption = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const isExcludedRoute = matchPaths(EXCLUDED_ROUTES, location.pathname).some(Boolean);
  const isListening = !secureTokensStorage.getTokens()?.refreshToken && !isExcludedRoute;

  useEffect(() => {
    if (!isListening) {
      // Both outlive the reload that reaches the session: the marker sits in session storage, and
      // the banner sits in a store persisted to it. Left behind, they would follow the tab in.
      sessionStorage.removeItem(SESSION_ELSEWHERE_KEY);
      dispatch(actions.removeBanner({ key: 'SessionElsewhereBanner' }));

      return;
    }

    let fallbackTimer: ReturnType<typeof setTimeout>;
    // Two tabs can answer in the same tick, and nothing re-renders in between.
    let hasRaised = false;

    const raiseBanner = () => {
      if (hasRaised || sessionStorage.getItem(SESSION_ELSEWHERE_KEY)) return;
      hasRaised = true;

      // Read by the login form when Sign in is pressed. Kept apart from the banner, which the user
      // can dismiss — dismissing a message is not consent to start a second session.
      sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true');
      dispatch(actions.addBanner({ key: 'SessionElsewhereBanner', order: BannerOrder.Top }));
    };

    // Nobody answered, so no live tab is left to hand the session over — the last one was closed.
    // The activity clock is the only witness left that there is anything to go back to.
    const raiseBannerFromClock = () => {
      const lastActivityAt = getLastActivityAt();
      if (!lastActivityAt) return;

      // Past its deadline the session is over anyway, and the boot check clears it. Reloading
      // would only land on the same login page.
      if (Date.now() - lastActivityAt >= resolveSessionConfig().idleTimeoutMs) return;

      raiseBanner();
    };

    const armFallback = () => {
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(raiseBannerFromClock, SESSION_REQUEST_WINDOW_MS);
    };

    const unsubscribe = subscribeSessionSync((message) => {
      if (message.type !== 'SESSION_STATE') return;

      // No session id check: a tab with no session of its own has nothing to compare against, and
      // the announcement is by definition the one it would be joining.
      clearTimeout(fallbackTimer);
      raiseBanner();
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      publishSessionMessage({ type: 'SESSION_REQUEST' });
      armFallback();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Asked here as well, not only on the next focus change: a tab that has just been reloaded out
    // of a session it no longer owns is already visible, so no visibilitychange is coming, and
    // nothing else would ever ask on its behalf.
    publishSessionMessage({ type: 'SESSION_REQUEST' });
    armFallback();

    return () => {
      clearTimeout(fallbackTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
  }, [isListening, dispatch]);
};
