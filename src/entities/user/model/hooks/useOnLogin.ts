import { useUserState } from './useUserState';
import { secureUserPrivateKeyStorage } from '../secureUserPrivateKeyStorage';

import { ROUTES } from '~/shared/constants';
import { Mixpanel, secureTokensStorage, useCustomNavigation, useEncryption } from '~/shared/utils';
import { LaunchDarkly } from '~/shared/utils/featureFlags';

type Params = {
  backRedirectPath?: string | undefined;
};

type OnLoginSuccessParams = {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
  };
};

export const useOnLogin = (params: Params) => {
  const { navigate } = useCustomNavigation();
  const { setUser } = useUserState();
  const { generateUserPrivateKey } = useEncryption();

  const onLoginSuccess = ({ user, tokens }: OnLoginSuccessParams) => {
    const userPrivateKey = generateUserPrivateKey({
      userId: user.id,
      email: user.email,
      password: user.password,
    });
    secureUserPrivateKeyStorage.setUserPrivateKey(userPrivateKey);

    setUser({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
    secureTokensStorage.setTokens(tokens);

    if (params.backRedirectPath !== undefined) {
      navigate(params.backRedirectPath);
    } else {
      Mixpanel.track('Login Successful');
      Mixpanel.login(user.id);

      navigate(ROUTES.appletList.path);
      LaunchDarkly.login(user.id);
    }
  };

  return { onLoginSuccess };
};
