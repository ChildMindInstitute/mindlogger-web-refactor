import { useState, useCallback, useRef } from 'react';

import { MFASessionState } from '../model/mfa.types';

import { useMFAVerifyMutation, useMFARecoveryMutation } from '~/entities/user';
import { secureTokensStorage } from '~/shared/utils';

export type MFAVerificationType = 'totp' | 'recovery';

const MAX_ATTEMPTS = 5;
const WARNING_THRESHOLD = 3;

interface UseMFAVerificationArgs {
  type: MFAVerificationType;
  /** MFA session from local state (security sensitive) */
  session: MFASessionState | null;
  /** Increment attempts in local session state */
  onIncrementAttempts: () => void;
  onSuccess: (result: { user: UserData; tokens: TokenData; password: string }) => void;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

/**
 * Helper to detect session expiry from backend error message
 * Matches admin pattern: Auth.reducer.ts isSessionExpiredError()
 *
 * TODO: Use exact error codes from backend instead of string matching:
 * - AuthErrorCode.MFA_SESSION_NOT_FOUND
 * - MFATokenExpiredError
 * - MFATokenInvalidError
 * See: mindlogger-backend-refactor/src/apps/authentication/constants.py
 */
const isSessionExpiredError = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('session not found') ||
    lower.includes('expired') ||
    lower.includes('session expired')
  );
};

/**
 * Custom hook for MFA verification logic
 *
 * STATE ARCHITECTURE (following admin M2-10238 pattern):
 * - All state is local - no Redux for errors
 * - API responses drive error display
 * - Session expiry detected from backend response (not local timer)
 * - MFAForm handles translation of displayError keys
 *
 * STICKY SESSION EXPIRED BEHAVIOR:
 * - When backend returns expired/session-not-found, isSessionExpired = true
 * - Input + Continue disabled, attempts stop incrementing
 * - Error cannot be cleared (terminal state)
 * - Recovery screen shows "Back to Log In" only when expired
 */
export const useMFAVerification = ({
  type,
  session,
  onIncrementAttempts,
  onSuccess,
}: UseMFAVerificationArgs) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);
  const hasSessionExpiredRef = useRef(false);

  const attempts = session?.attempts || 0;

  // TOTP mutation
  const { mutateAsync: verifyTOTP } = useMFAVerifyMutation();

  // Recovery mutation
  const { mutateAsync: verifyRecovery } = useMFARecoveryMutation();

  // Verify code - API response drives all error states
  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      // Don't call API if session already expired (terminal state)
      if (isSessionExpired) return false;
      if (isSubmitting) return false;
      if (!session) return false;

      setIsSubmitting(true);
      setDisplayError(null);

      try {
        // TODO: Consider passing deviceId for device tracking
        const response =
          type === 'totp'
            ? await verifyTOTP({ mfaToken: session.token, totpCode: code })
            : await verifyRecovery({ mfaToken: session.token, code });

        const result = response.data.result;

        // Store tokens securely
        secureTokensStorage.setTokens(result.token);

        // Trigger success callback with password for encryption key derivation
        onSuccess({
          user: result.user,
          tokens: result.token,
          password: session.loginPassword,
        });

        return true;
      } catch (error: unknown) {
        const err = error as { evaluatedMessage?: string; message?: string };
        const errorMessage = err?.evaluatedMessage || err?.message || 'Invalid verification code';

        // CHECK FOR EXPIRY FROM BACKEND FIRST - before anything else
        if (isSessionExpiredError(errorMessage)) {
          if (!hasSessionExpiredRef.current) {
            hasSessionExpiredRef.current = true;
            setIsSessionExpired(true);
            setDisplayError('mfaSessionExpired');
          }
          // Do NOT increment attempts for expired session
          return false;
        }

        // Normal invalid code flow - increment attempts
        // TODO: Use attempts_remaining from API response instead of client-side tracking
        onIncrementAttempts();
        const newAttempts = attempts + 1;

        // Set displayError based on type and attempt count
        if (type === 'totp') {
          if (newAttempts >= WARNING_THRESHOLD && newAttempts < MAX_ATTEMPTS) {
            // Format: "invalidCode|2" for 2 attempts remaining
            setDisplayError(`invalidCode|${MAX_ATTEMPTS - newAttempts}`);
          } else {
            setDisplayError('invalidCode');
          }
        } else {
          // Recovery codes don't track attempts
          setDisplayError('invalidRecoveryCode');
        }

        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      session,
      isSessionExpired,
      isSubmitting,
      type,
      verifyTOTP,
      verifyRecovery,
      onSuccess,
      onIncrementAttempts,
      attempts,
    ],
  );

  // Clear error when user types (but not session-expired errors - they're terminal)
  const clearError = useCallback(() => {
    if (isSessionExpired || displayError === 'mfaSessionExpired') {
      return; // Don't clear terminal errors
    }
    setDisplayError(null);
  }, [isSessionExpired, displayError]);

  return {
    // Local state - API driven
    displayError,
    isSessionExpired,
    isSubmitting,
    attempts,
    maxAttempts: MAX_ATTEMPTS,

    // Actions
    verifyCode,
    clearError,
  };
};
