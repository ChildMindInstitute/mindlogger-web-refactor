import { useState, useCallback, useRef } from 'react';

import { useMFASessionExpiry } from './useMFASessionExpiry';
import { MFAState, MFAAction } from '../model/mfa.types';

import { useMFAVerifyMutation, useMFARecoveryMutation } from '~/entities/user';
import { secureTokensStorage } from '~/shared/utils';

export type MFAVerificationType = 'totp' | 'recovery';

const MAX_ATTEMPTS = 5;
const WARNING_THRESHOLD = 3;

interface UseMFAVerificationArgs {
  type: MFAVerificationType;
  mfaState: MFAState;
  dispatch: React.Dispatch<MFAAction>;
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
 * Custom hook for MFA verification logic
 *
 * This hook manages:
 * - TOTP and Recovery code verification via API
 * - Attempt tracking and error display
 * - Session expiry detection (both timer-based and backend response)
 * - Secure token storage on success
 *
 * CRITICAL: Uses in-memory state (NOT Redux) for security
 */
export const useMFAVerification = ({
  type,
  mfaState,
  dispatch,
  onSuccess,
}: UseMFAVerificationArgs) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSessionExpiredRef = useRef(false);

  const { session, verification } = mfaState;
  const attempts = session?.attempts || 0;

  // Handle session expiry
  const handleSessionExpired = useCallback(() => {
    if (hasSessionExpiredRef.current) return;
    hasSessionExpiredRef.current = true;
    dispatch({ type: 'SET_SESSION_EXPIRED' });
  }, [dispatch]);

  // Use session expiry hook
  useMFASessionExpiry({ mfaSession: session, onExpire: handleSessionExpired });

  // TOTP mutation
  const { mutateAsync: verifyTOTP } = useMFAVerifyMutation();

  // Recovery mutation
  const { mutateAsync: verifyRecovery } = useMFARecoveryMutation();

  // Verify code
  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      // Don't call API if session already expired
      if (verification.isSessionExpired) return false;
      if (isSubmitting) return false;
      if (!session) return false;

      // Check if session has expired locally
      if (Date.now() > session.expiresAt) {
        handleSessionExpired();
        return false;
      }

      setIsSubmitting(true);
      dispatch({ type: 'SET_LOADING' });

      try {
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

        dispatch({ type: 'SET_IDLE' });
        return true;
      } catch (error: unknown) {
        const err = error as { evaluatedMessage?: string; message?: string };
        const errorMessage = err?.evaluatedMessage || err?.message || 'Invalid verification code';

        // Check for session expiry errors from backend
        const lowerMessage = errorMessage.toLowerCase();
        if (
          lowerMessage.includes('session not found') ||
          lowerMessage.includes('expired') ||
          lowerMessage.includes('session expired')
        ) {
          handleSessionExpired();
          return false;
        }

        // Increment attempts
        dispatch({ type: 'INCREMENT_ATTEMPTS' });
        const newAttempts = attempts + 1;

        // Determine display error based on type and attempt count
        let displayError = type === 'totp' ? 'invalidCode' : 'invalidRecoveryCode';
        if (type === 'totp' && newAttempts >= WARNING_THRESHOLD && newAttempts < MAX_ATTEMPTS) {
          // Format: "invalidCode|2" for 2 attempts remaining
          displayError = `invalidCode|${MAX_ATTEMPTS - newAttempts}`;
        }

        dispatch({
          type: 'SET_VERIFICATION_ERROR',
          payload: { error: errorMessage, displayError },
        });

        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      session,
      verification.isSessionExpired,
      isSubmitting,
      type,
      verifyTOTP,
      verifyRecovery,
      onSuccess,
      dispatch,
      handleSessionExpired,
      attempts,
    ],
  );

  // Clear error when user types (but not session-expired errors)
  const clearError = useCallback(() => {
    // Don't clear session-expired errors - they're terminal
    if (verification.isSessionExpired || verification.displayError === 'mfaSessionExpired') {
      return;
    }
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch, verification.isSessionExpired, verification.displayError]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    hasSessionExpiredRef.current = false;
  }, []);

  return {
    // State
    error: verification.error,
    displayError: verification.displayError,
    isSessionExpired: verification.isSessionExpired,
    isSubmitting,
    attempts,
    maxAttempts: MAX_ATTEMPTS,

    // Actions
    verifyCode,
    clearError,
    cleanup,
  };
};
