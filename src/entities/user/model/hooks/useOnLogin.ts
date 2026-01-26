import { useUserState } from './useUserState';
import { secureUserPrivateKeyStorage } from '../secureUserPrivateKeyStorage';

import ROUTES from '~/shared/constants/routes';
import {
  Mixpanel,
  MixpanelEventType,
  secureTokensStorage,
  useCustomNavigation,
  useEncryption,
} from '~/shared/utils';
import { FeatureFlags } from '~/shared/utils/featureFlags';

type Params = {
  backRedirectPath?: string | undefined;
};

type OnLoginSuccessParams = {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    /**
     * Password is optional - only needed for non-MFA login.
     * For MFA login, private key is already derived and stored before MFA verification.
     */
    password?: string;
  };
  /**
   * Tokens are optional - only needed for non-MFA login.
   * For MFA login, tokens are already stored by useMFAVerification before calling onLoginSuccess.
   */
  tokens?: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
  };
};

/**
 * Hook for completing login after authentication.
 *
 * Handles two scenarios:
 * 1. Non-MFA login: password provided → derive and store private key
 * 2. MFA login: password not provided → private key already stored (derived before MFA)
 */
export const useOnLogin = (params: Params) => {
  const { navigate } = useCustomNavigation();
  const { setUser } = useUserState();
  const { generateUserPrivateKey } = useEncryption();

  const onLoginSuccess = ({ user, tokens }: OnLoginSuccessParams) => {
    // For non-MFA login: derive and store private key
    // For MFA login: private key is already stored (derived before MFA verification)
    if (user.password) {
      const userPrivateKey = generateUserPrivateKey({
        userId: user.id,
        email: user.email,
        password: user.password,
      });
      secureUserPrivateKeyStorage.setUserPrivateKey(userPrivateKey);
    }

    // Set user in Redux
    setUser({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });

    // Store tokens only if provided (non-MFA flow)
    // For MFA flow, tokens are already stored by useMFAVerification
    if (tokens) {
      secureTokensStorage.setTokens(tokens);
    }

    // Navigate
    if (params.backRedirectPath !== undefined) {
      navigate(params.backRedirectPath, { replace: true });
    } else {
      Mixpanel.track({ action: MixpanelEventType.LoginSuccessful });
      Mixpanel.login(user.id);
      navigate(ROUTES.appletList.path);
      FeatureFlags.login(user.id);
    }
  };

  return { onLoginSuccess };
};
