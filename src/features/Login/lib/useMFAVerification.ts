import { useState, useCallback, useRef } from 'react';

import { getMfaErrorResult, MfaVerificationType } from './mfaErrorHandler';
import { MFASessionState } from '../model/mfa.types';

import { useMFAVerifyMutation, useMFARecoveryMutation } from '~/entities/user';
import { secureTokensStorage } from '~/shared/utils';

export type { MfaVerificationType };

const WARNING_THRESHOLD = 3;

interface UseMFAVerificationArgs {
  type: MfaVerificationType;
  /** MFA session from local state (security sensitive) */
  session: MFASessionState | null;
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
 * STATE ARCHITECTURE:
 * - All state is local - no Redux for errors
 * - API responses drive error display and attempts tracking
 * - Session expiry detected from backend error_code (not string matching)
 * - MFAForm handles translation of displayError keys
 *
 * API-DRIVEN ERROR HANDLING:
 * - Uses error_code field from API response
 * - Uses metadata.session_attempts_remaining from API response
 * - Falls back to generic errors if error_code not present
 *
 * STICKY SESSION EXPIRED BEHAVIOR:
 * - When backend returns expired/session-not-found error codes, isSessionExpired = true
 * - Input + Continue disabled
 * - Error cannot be cleared (terminal state)
 * - Recovery screen shows "Back to Log In" only when expired
 */
export const useMFAVerification = ({ type, session, onSuccess }: UseMFAVerificationArgs) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const hasSessionExpiredRef = useRef(false);

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
        // Use API-driven error handling
        const {
          translationKey,
          isSessionExpired: expired,
          attemptsRemaining: remaining,
        } = getMfaErrorResult(error, type);

        // Handle session expiry (terminal state)
        if (expired && !hasSessionExpiredRef.current) {
          hasSessionExpiredRef.current = true;
          setIsSessionExpired(true);
        }

        // Update attempts from API metadata
        setAttemptsRemaining(remaining);

        // Set display error (simple key, or key with attempts if warning threshold)
        if (remaining !== null && remaining <= WARNING_THRESHOLD && !expired) {
          // Format: "invalidCode|2" for 2 attempts remaining
          setDisplayError(`${translationKey}|${remaining}`);
        } else {
          setDisplayError(translationKey);
        }

        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [session, isSessionExpired, isSubmitting, type, verifyTOTP, verifyRecovery, onSuccess],
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
    attemptsRemaining,

    // Actions
    verifyCode,
    clearError,
  };
};
