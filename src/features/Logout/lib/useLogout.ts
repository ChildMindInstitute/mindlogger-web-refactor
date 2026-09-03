import { useCallback } from 'react';

import { useLocation } from 'react-router-dom';

import { queryClient } from '~/app/providers/react-query';
import { persistor } from '~/app/store';
import { appletModel } from '~/entities/applet';
import { useLogoutMutation, userModel } from '~/entities/user';
import { AutoCompletionModel } from '~/features/AutoCompletion';
import ROUTES from '~/shared/constants/routes';
import {
  clearSessionState,
  getSessionId,
  LogoutReason,
  Mixpanel,
  MixpanelEventType,
  ownsActiveSession,
  publishSessionMessage,
  leaveEndedSession,
  secureTokensStorage,
  useCustomNavigation,
} from '~/shared/utils';
import { FeatureFlags } from '~/shared/utils/featureFlags';

type LogoutOptions = {
  // Set when another tab already ended this session, so the parts it has done are not repeated.
  isRemote?: boolean;
  reason?: LogoutReason;
};

type UseLogoutReturn = {
  logout: (options?: LogoutOptions) => void;
  isLoading: boolean;
};

export const useLogout = (): UseLogoutReturn => {
  const navigator = useCustomNavigation();
  const location = useLocation();

  const { clearUser } = userModel.hooks.useUserState();
  const { clearStore } = appletModel.hooks.useClearStore();
  const { clearAutoCompletionState } = AutoCompletionModel.useAutoCompletionStateManager();

  const { mutate: logoutMutation, isLoading } = useLogoutMutation();

  const logout = useCallback(
    ({ isRemote = false, reason = 'manual' }: LogoutOptions = {}) => {
      // Every teardown funnels through here, so this is the one place that has to refuse. A tab
      // that slept through a logout and someone else signing in would clear a store that is theirs
      // now — tokens, encryption key, answers in progress — signing them out of every tab. It
      // leaves for the login page instead.
      if (!ownsActiveSession()) return leaveEndedSession();

      const tokens = secureTokensStorage.getTokens();

      if (!isRemote) {
        // Sent before the teardown below, which clears the token the session id is read from. A
        // tab that hears late spends the gap making requests only a 401 can answer.
        const sessionId = getSessionId();
        if (sessionId) publishSessionMessage({ type: 'LOGOUT', payload: { sessionId, reason } });

        // A remote logout follows the tab that already revoked the family; asking again only 401s.
        if (tokens?.accessToken) {
          logoutMutation({ accessToken: tokens.accessToken });
        }
      }

      clearUser();
      clearStore();
      clearAutoCompletionState();
      // Persisting is normally left to a timer, which a frozen tab does not run. The write would
      // then land on the next sign-in's user rather than this one, signing them out everywhere.
      void persistor.flush();
      queryClient.clear();
      secureTokensStorage.clearTokens();
      userModel.secureUserPrivateKeyStorage.clearUserPrivateKey();
      // Left behind, the next sign-in reads a deadline that passed while nobody was signed in, and
      // ends the session it has only just started.
      clearSessionState();

      // The tab that started it already recorded the event. Identity still has to be reset here,
      // since both SDKs are per tab.
      if (!isRemote) Mixpanel.track({ action: MixpanelEventType.Logout });
      Mixpanel.logout();
      FeatureFlags.logout();

      const backRedirectPath = `${location.pathname}${location.search}`;
      return navigator.navigate(ROUTES.login.path, { state: { backRedirectPath } });
    },
    [
      clearUser,
      clearStore,
      clearAutoCompletionState,
      location.pathname,
      location.search,
      navigator,
      logoutMutation,
    ],
  );

  return {
    logout,
    isLoading,
  };
};
