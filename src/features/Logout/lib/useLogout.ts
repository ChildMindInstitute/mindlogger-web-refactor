import { useCallback } from 'react';

import { appletModel } from '~/entities/applet';
import { useLogoutMutation, userModel } from '~/entities/user';
import { ROUTES } from '~/shared/constants';
import { Mixpanel, secureTokensStorage, useCustomNavigation } from '~/shared/utils';
import { FeatureFlags } from '~/shared/utils/featureFlags';

type UseLogoutReturn = {
  logout: () => void;
  isLoading: boolean;
};

export const useLogout = (): UseLogoutReturn => {
  const navigator = useCustomNavigation();

  const { clearUser } = userModel.hooks.useUserState();
  const { clearStore } = appletModel.hooks.useClearStore();

  const { mutate: logoutMutation, isLoading } = useLogoutMutation();

  const logout = useCallback(() => {
    const tokens = secureTokensStorage.getTokens();

    if (tokens?.accessToken) {
      logoutMutation({ accessToken: tokens.accessToken });
    }

    clearUser();
    clearStore();
    secureTokensStorage.clearTokens();
    userModel.secureUserPrivateKeyStorage.clearUserPrivateKey();

    Mixpanel.track('logout');
    Mixpanel.logout();
    FeatureFlags.logout();
    return navigator.navigate(ROUTES.login.path);
  }, [clearUser, logoutMutation, navigator, clearStore]);

  return {
    logout,
    isLoading,
  };
};
