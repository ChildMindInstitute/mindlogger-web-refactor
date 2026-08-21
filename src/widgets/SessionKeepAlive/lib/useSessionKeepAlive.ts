import { useCallback, useEffect, useRef, useState } from 'react';

import { useLogout } from '~/features/Logout';
import { refreshTokens } from '~/shared/api';
import {
  COUNTDOWN_TICK_MS,
  getLastActivityAt,
  getSessionId,
  getTokenExpiration,
  publishSessionMessage,
  resolveSessionConfig,
  secureTokensStorage,
  SESSION_REQUEST_WINDOW_MS,
  SessionMessage,
  SessionState,
  setLastActivityAt,
  startActivityTracking,
  stopActivityTracking,
  subscribeSessionSync,
} from '~/shared/utils';

// Mounted inside ProtectedRoute, which already refuses to render without a token, so there is no
// authorization check here. Logging out unmounts the route and the cleanup below runs.
export const useSessionKeepAlive = () => {
  const { logout } = useLogout();

  // Refreshed every render so the logout never closes over a stale route.
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  // Reached by the warning's buttons, which answer the countdown without owning the timers.
  const extendRef = useRef<(() => void) | null>(null);
  const endRef = useRef<((options?: Parameters<typeof logout>[0]) => void) | null>(null);

  // Milliseconds left to answer in, or null while the deadline is still far off.
  const [msRemaining, setMsRemaining] = useState<number | null>(null);

  useEffect(() => {
    const { idleTimeoutMs, refreshLeadMs, warningLeadMs } = resolveSessionConfig();
    let refreshTimer: ReturnType<typeof setTimeout>;
    let logoutTimer: ReturnType<typeof setTimeout>;
    let warningTimer: ReturnType<typeof setTimeout>;
    let catchUpTimer: ReturnType<typeof setTimeout>;
    let hasEnded = false;

    const endSession = (options?: Parameters<typeof logout>[0]) => {
      if (hasEnded) return;
      hasEnded = true;
      setMsRemaining(null);
      logoutRef.current(options);
    };

    const schedule = () => {
      if (hasEnded) return;
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);

      const idleDeadline = (getLastActivityAt() ?? Date.now()) + idleTimeoutMs;
      const msUntilLogout = idleDeadline - Date.now();
      if (msUntilLogout <= 0) return endSession({ reason: 'idle' });

      // The last stretch belongs to the countdown, not to another pass through here: re-deriving
      // the capped refresh lead every second would halve it away to nothing.
      if (msUntilLogout <= warningLeadMs) {
        setMsRemaining(msUntilLogout);
        warningTimer = setTimeout(tick, COUNTDOWN_TICK_MS);
      } else {
        setMsRemaining(null);
        warningTimer = setTimeout(tick, msUntilLogout - warningLeadMs);
      }

      // Re-enters schedule rather than ending outright: the clock is shared, so another tab may
      // have pushed the deadline out while this one sat idle.
      logoutTimer = setTimeout(schedule, msUntilLogout);

      // Read at decision time, since an earlier refresh may have replaced the token.
      const expiresAt = getTokenExpiration(secureTokensStorage.getTokens()?.accessToken);
      if (expiresAt === null) return;

      // Capped so a token shorter-lived than the lead does not refresh on every tick.
      const lead = Math.min(refreshLeadMs, (expiresAt - Date.now()) / 2);
      refreshTimer = setTimeout(refresh, Math.max(expiresAt - lead - Date.now(), 0));
    };

    // Redraws the countdown off the shared clock, which is how a sibling answering the warning
    // closes this tab's copy of it too.
    const tick = () => {
      const msLeft = (getLastActivityAt() ?? Date.now()) + idleTimeoutMs - Date.now();
      if (msLeft <= 0) return endSession({ reason: 'idle' });

      // The deadline moved out from under us, so hand back to the scheduler and stop counting.
      if (msLeft > warningLeadMs) return schedule();

      setMsRemaining(msLeft);
      warningTimer = setTimeout(tick, COUNTDOWN_TICK_MS);
    };

    // Answering counts as activity, so siblings showing the same warning close it on their next tick.
    const extendSession = () => {
      if (hasEnded) return;

      setLastActivityAt(Date.now());
      schedule();
    };

    const refresh = async () => {
      try {
        await refreshTokens();
        schedule();
      } catch {
        endSession({ reason: 'refresh-failed' });
      }
    };

    // A suspended tab's timers do not fire on time, so the deadline is re-checked on return rather
    // than waiting for a timer the browser may have parked.
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      // Tracking keeps this clock while the tab is signed in, and only a teardown removes it. Gone
      // means the session ended somewhere a frozen tab could not hear, and no message is coming.
      if (!getLastActivityAt()) return endSession({ isRemote: true });

      // Ask first and give the answer a beat: a token gone stale during sleep would otherwise
      // refresh at zero delay, losing the race against a sibling handing over fresher ones.
      publishSessionMessage({ type: 'SESSION_REQUEST' });
      clearTimeout(catchUpTimer);
      catchUpTimer = setTimeout(schedule, SESSION_REQUEST_WINDOW_MS);
    };

    // Only tabs with a live session run this hook, which is what keeps a logged-out one silent.
    const announceSession = () => {
      const sessionId = getSessionId();
      const tokens = secureTokensStorage.getTokens();
      if (!sessionId || !tokens?.accessToken || !tokens.refreshToken) return;

      publishSessionMessage({
        type: 'SESSION_STATE',
        payload: {
          sessionId,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    };

    // Spread over what this tab holds, so tokenType survives: the message carries only the pair.
    // Rescheduling re-arms the refresh from the new expiry instead of the one just replaced.
    const adoptTokens = ({ accessToken, refreshToken }: SessionState) => {
      const tokens = secureTokensStorage.getTokens();
      if (!tokens) return;

      secureTokensStorage.setTokens({ ...tokens, accessToken, refreshToken });
      schedule();
    };

    const handleSyncMessage = (message: SessionMessage) => {
      if (message.type === 'SESSION_REQUEST') return announceSession();

      // A sibling's answer may carry tokens that replaced this tab's while it slept. Every rotation
      // mints a later expiry, so the further-off one is the newer generation.
      if (message.type === 'SESSION_STATE') {
        const { sessionId, accessToken } = message.payload;
        if (sessionId !== getSessionId()) return;

        const offered = getTokenExpiration(accessToken);
        const held = getTokenExpiration(secureTokensStorage.getTokens()?.accessToken);
        if (offered === null || (held !== null && offered <= held)) return;

        adoptTokens(message.payload);

        return;
      }

      // A sibling ended the session for all of us, so tear down without revoking it again.
      if (message.type === 'LOGOUT') {
        if (message.payload.sessionId !== getSessionId()) return;

        endSession({ isRemote: true });

        return;
      }

      // Adopting a sibling's rotation keeps this tab from spending a token it has already replaced.
      if (message.type !== 'TOKENS_UPDATED') return;
      if (message.payload.sessionId !== getSessionId()) return;

      adoptTokens(message.payload);
    };

    const unsubscribe = subscribeSessionSync(handleSyncMessage);

    startActivityTracking(schedule);
    extendRef.current = extendSession;
    endRef.current = endSession;
    document.addEventListener('visibilitychange', handleVisibilityChange);
    schedule();

    // A tab frozen past a rotation falls back in step the moment it starts, rather than waiting
    // for its next refresh and spending a token that has already been replaced.
    publishSessionMessage({ type: 'SESSION_REQUEST' });
    // Unprompted, because a tab still on the login page has no session to ask with. This is how
    // it hears that one has just begun.
    announceSession();

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      clearTimeout(catchUpTimer);
      setMsRemaining(null);
      extendRef.current = null;
      endRef.current = null;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopActivityTracking();
      unsubscribe();
    };
  }, []);

  const stayLoggedIn = useCallback(() => extendRef.current?.(), []);
  const logOutNow = useCallback(() => endRef.current?.({ reason: 'manual' }), []);

  return { msRemaining, stayLoggedIn, logOutNow };
};
