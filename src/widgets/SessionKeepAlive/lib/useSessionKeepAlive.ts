import { useEffect, useRef } from 'react';

import { useLogout } from '~/features/Logout';
import { refreshTokens } from '~/shared/api';
import {
  getLastActivityAt,
  getSessionId,
  getTokenExpiration,
  publishSessionMessage,
  resolveSessionConfig,
  secureTokensStorage,
  SESSION_REQUEST_WINDOW_MS,
  SessionMessage,
  SessionState,
  startActivityTracking,
  stopActivityTracking,
  subscribeSessionSync,
  useFeatureFlags,
} from '~/shared/utils';
import { FeatureFlag } from '~/shared/utils/types/featureFlags';

// Mounted inside ProtectedRoute, which already refuses to render without a token, so there is no
// authorization check here. Logging out unmounts the route and the cleanup below runs.
export const useSessionKeepAlive = () => {
  const { featureFlag } = useFeatureFlags();
  const { logout } = useLogout();

  // Refreshed every render so the logout never closes over a stale route.
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  // The idle timer is not flagged: it replaces the only idle logout this app has, and gating it
  // would leave the session running unbounded until someone flips a switch.
  const isRefreshEnabled = featureFlag(FeatureFlag.EnableSessionKeepAlive, false);

  useEffect(() => {
    const { idleTimeoutMs, refreshLeadMs } = resolveSessionConfig();
    let refreshTimer: ReturnType<typeof setTimeout>;
    let logoutTimer: ReturnType<typeof setTimeout>;
    let catchUpTimer: ReturnType<typeof setTimeout>;
    let hasEnded = false;

    const endSession = (options?: Parameters<typeof logout>[0]) => {
      if (hasEnded) return;
      hasEnded = true;
      logoutRef.current(options);
    };

    const schedule = () => {
      if (hasEnded) return;
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);

      const idleDeadline = (getLastActivityAt() ?? Date.now()) + idleTimeoutMs;
      const msUntilLogout = idleDeadline - Date.now();
      if (msUntilLogout <= 0) return endSession({ reason: 'idle' });

      // Re-enters schedule rather than ending outright: the clock is shared, so another tab may
      // have pushed the deadline out while this one sat idle.
      logoutTimer = setTimeout(schedule, msUntilLogout);

      if (!isRefreshEnabled) return;

      // Read at decision time, since an earlier refresh may have replaced the token.
      const expiresAt = getTokenExpiration(secureTokensStorage.getTokens()?.accessToken);
      if (expiresAt === null) return;

      // Capped so a token shorter-lived than the lead does not refresh on every tick.
      const lead = Math.min(refreshLeadMs, (expiresAt - Date.now()) / 2);
      refreshTimer = setTimeout(refresh, Math.max(expiresAt - lead - Date.now(), 0));
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
      if (!isRefreshEnabled) return schedule();

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

    // Only while the flag is on, which is also what keeps the publishers above silent: nothing is
    // broadcast at all when no tab is listening.
    const unsubscribe = isRefreshEnabled ? subscribeSessionSync(handleSyncMessage) : undefined;

    startActivityTracking(schedule);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    schedule();

    if (isRefreshEnabled) {
      // A tab frozen past a rotation falls back in step the moment it starts, rather than waiting
      // for its next refresh and spending a token that has already been replaced.
      publishSessionMessage({ type: 'SESSION_REQUEST' });
      // Unprompted, because a tab still on the login page has no session to ask with. This is how
      // it hears that one has just begun.
      announceSession();
    }

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);
      clearTimeout(catchUpTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopActivityTracking();
      unsubscribe?.();
    };
  }, [isRefreshEnabled]);
};
