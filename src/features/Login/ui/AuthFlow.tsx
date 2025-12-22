import { useState, useCallback } from 'react';

import { LoginForm } from './LoginForm';
import { MFAForm } from './MFAForm';
import { RecoveryCodeForm } from './RecoveryCodeForm';
import { MFAProvider, useMFAContext } from '../lib/MFAContext';
import { AuthFlowState, MFARequiredResponse } from '../model/mfa.types';

import { userModel } from '~/entities/user';

interface AuthFlowProps {
  locationState?: Record<string, unknown>;
}

/**
 * AuthFlow Inner Component
 *
 * SIMPLIFIED STATE MACHINE:
 * - flowState: Which form to show (explicit changes only via callbacks)
 * - MFA session: Managed by MFAContext (isolated, won't cause re-renders here)
 * - Error state: Local to MFA components (API-driven)
 *
 * No reactive useEffects - all flow changes are explicit.
 */
const AuthFlowInner = ({ locationState }: AuthFlowProps) => {
  const [flowState, setFlowState] = useState<AuthFlowState>('login');
  const { setSession, clearSession } = useMFAContext();

  const { onLoginSuccess } = userModel.hooks.useOnLogin({
    backRedirectPath: locationState?.backRedirectPath as string,
  });

  // Handle MFA required response from login
  const handleMFARequired = useCallback(
    (mfaData: MFARequiredResponse, password: string) => {
      setSession(mfaData.mfaToken, mfaData.mfaSessionId, password);
      setFlowState('mfa-totp');
    },
    [setSession],
  );

  // Handle successful MFA verification
  const handleMFASuccess = useCallback(
    (result: {
      user: { id: string; firstName: string; lastName: string; email: string };
      tokens: { accessToken: string; refreshToken: string; tokenType: string };
      password: string;
    }) => {
      onLoginSuccess({
        user: {
          ...result.user,
          password: result.password,
        },
        tokens: result.tokens,
      });
    },
    [onLoginSuccess],
  );

  // Navigation handlers
  const handleSwitchToRecovery = useCallback(() => {
    setFlowState('mfa-recovery');
  }, []);

  const handleSwitchToTOTP = useCallback(() => {
    setFlowState('mfa-totp');
  }, []);

  const handleBackToLogin = useCallback(() => {
    clearSession();
    setFlowState('login');
  }, [clearSession]);

  // Render appropriate form based on flow state
  switch (flowState) {
    case 'mfa-totp':
      return (
        <MFAForm
          onSuccess={handleMFASuccess}
          onSwitchToRecovery={handleSwitchToRecovery}
          onBackToLogin={handleBackToLogin}
        />
      );

    case 'mfa-recovery':
      return (
        <RecoveryCodeForm
          onSuccess={handleMFASuccess}
          onSwitchToTOTP={handleSwitchToTOTP}
          onBackToLogin={handleBackToLogin}
        />
      );

    case 'login':
    default:
      return <LoginForm locationState={locationState} onMFARequired={handleMFARequired} />;
  }
};

/**
 * AuthFlow Component
 *
 * Wraps inner component with MFAProvider to isolate MFA state.
 * MFA errors won't cause this component or LoginForm to re-render.
 */
export const AuthFlow = ({ locationState }: AuthFlowProps) => {
  return (
    <MFAProvider>
      <AuthFlowInner locationState={locationState} />
    </MFAProvider>
  );
};
