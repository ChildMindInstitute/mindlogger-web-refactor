import { useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { userModel } from '~/entities/user';
import { secureUserPrivateKeyStorage } from '~/entities/user/model/secureUserPrivateKeyStorage';
import { RecoveryCodeForm } from '~/features/Login';
import { mfaActions, selectMFASession } from '~/features/Login/model/mfa.slice';
import { ROUTES } from '~/shared/constants';
import { variables } from '~/shared/constants/theme/variables';
import { Box } from '~/shared/ui';

function MFARecoveryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get MFA session from Redux (blacklisted from persistence)
  const mfaSession = useSelector(selectMFASession);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- location.state is untyped in React Router
  const backRedirectPath =
    typeof location.state?.backRedirectPath === 'string'
      ? location.state.backRedirectPath
      : undefined;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- useOnLogin hook needs proper return type annotation
  const { onLoginSuccess } = userModel.hooks.useOnLogin({ backRedirectPath });

  // Route guard: redirect to login if no session
  useEffect(() => {
    if (!mfaSession) {
      navigate(ROUTES.login.path, { replace: true });
    }
  }, [mfaSession, navigate]);

  /**
   * Handle successful recovery code verification.
   * Private key is already stored (derived before navigation to MFA page).
   * Tokens are already stored by useMFAVerification before this callback.
   * Just set user and navigate.
   *
   * Memoized with useCallback to ensure stable reference for useMFAVerification dependency.
   */
  const handleRecoverySuccess = useCallback(
    (result: {
      user: { id: string; firstName: string; lastName: string; email: string };
      mfaUsed: boolean;
      mfaMethod: 'Authenticator App' | 'Backup Codes';
    }) => {
      // Clear MFA session after successful verification
      dispatch(mfaActions.clearMFASession());

      // Tokens already stored by useMFAVerification, just complete login
      onLoginSuccess({
        user: result.user,
        mfaUsed: result.mfaUsed,
        mfaMethod: result.mfaMethod,
      });
    },
    [dispatch, onLoginSuccess],
  );

  const handleSwitchToTOTP = useCallback(() => {
    // MFA session persists in Redux, no need to pass state
    const backRedirectPath =
      typeof location.state?.backRedirectPath === 'string'
        ? (location.state.backRedirectPath as string)
        : undefined;

    navigate(ROUTES.verifyMFA.path, {
      state: { backRedirectPath },
    });
  }, [navigate, location.state?.backRedirectPath]);

  const handleBackToLogin = useCallback(() => {
    // Clear MFA session and private key on abandonment
    dispatch(mfaActions.clearMFASession());
    secureUserPrivateKeyStorage.clearUserPrivateKey();
    navigate(ROUTES.login.path, { replace: true });
  }, [dispatch, navigate]);

  // Prevent flash of content when no session
  if (!mfaSession) {
    return null;
  }

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center">
      <Box
        sx={{
          display: 'flex',
          width: '473px',
          padding: '32px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          borderRadius: '16px',
          border: `1px solid ${variables.palette.surfaceVariant}`,
          background: variables.palette.surface,
        }}
      >
        <RecoveryCodeForm
          session={{ token: mfaSession.mfaToken, sessionId: mfaSession.mfaSessionId }}
          onSuccess={handleRecoverySuccess}
          onSwitchToTOTP={handleSwitchToTOTP}
          onBackToLogin={handleBackToLogin}
        />
      </Box>
    </Box>
  );
}

export default MFARecoveryPage;
