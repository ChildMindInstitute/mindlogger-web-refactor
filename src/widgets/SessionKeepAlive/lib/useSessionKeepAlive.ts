import { useEffect, useRef } from 'react';

import { useLogout } from '~/features/Logout';
import { refreshTokens } from '~/shared/api';
import {
  getLastActivityAt,
  getSessionId,
  getTokenExpiration,
  resolveSessionConfig,
  secureTokensStorage,
  SessionMessage,
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
    let hasEnded = false;

    const endSession = () => {
      if (hasEnded) return;
      hasEnded = true;
      logoutRef.current();
    };

    const schedule = () => {
      if (hasEnded) return;
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);

      const idleDeadline = (getLastActivityAt() ?? Date.now()) + idleTimeoutMs;
      const msUntilLogout = idleDeadline - Date.now();
      if (msUntilLogout <= 0) return endSession();

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
        endSession();
      }
    };

    // A suspended tab's timers do not fire on time, so the deadline is re-checked on return rather
    // than waiting for a timer the browser may have parked.
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      schedule();
    };

    // Adopting a sibling's rotation keeps this tab from spending a token it has already replaced.
    const handleSyncMessage = (message: SessionMessage) => {
      if (message.type !== 'TOKENS_UPDATED') return;

      const { sessionId, accessToken, refreshToken } = message.payload;
      if (sessionId !== getSessionId()) return;

      const tokens = secureTokensStorage.getTokens();
      if (!tokens) return;

      secureTokensStorage.setTokens({ ...tokens, accessToken, refreshToken });
      schedule();
    };

    // Only while the flag is on, which is also what keeps the publishers above silent: nothing is
    // broadcast at all when no tab is listening.
    const unsubscribe = isRefreshEnabled ? subscribeSessionSync(handleSyncMessage) : undefined;

    startActivityTracking(schedule);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    schedule();

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(logoutTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopActivityTracking();
      unsubscribe?.();
    };
  }, [isRefreshEnabled]);
};
