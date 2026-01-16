import { useState, useCallback, useRef } from 'react';

import { getMfaErrorResult, MfaVerificationType } from './mfaErrorHandler';

import { useMFAVerifyMutation, useMFARecoveryMutation } from '~/entities/user';
import { secureTokensStorage } from '~/shared/utils';

export type { MfaVerificationType };

const WARNING_THRESHOLD = 3;

/**
 * MFA session data - simplified (no password needed).
 * Private key is already derived and stored before navigating to MFA page.
 */
interface MFASessionData {
  token: string;
  sessionId: string;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface UseMFAVerificationArgs {
  type: MfaVerificationType;
  /** MFA session from Redux (blacklisted from persistence) */
  session: MFASessionData | null;
  /**
   * Called on successful verification - tokens are already stored before this callback.
   * Only receives user data since tokens are stored directly in useMFAVerification
   * to avoid race conditions with navigation.
   */
  onSuccess: (result: { user: UserData }) => void;
}

/**
 * Custom hook for MFA verification logic
 *
 * ARCHITECTURE:
 * - Private key is already derived and stored before navigation to MFA page
 * - This hook only handles MFA verification, not encryption key derivation
 * - Session data comes from Redux mfa slice (blacklisted from persistence)
 *
 * STATE ARCHITECTURE:
 * - All state is local - no Redux for errors
 * - API responses drive error display and attempts tracking
 * - Session expiry detected from backend error_code (not string matching)
 * - MFAForm handles translation of displayError keys
 *
 * API-DRIVEN ERROR HANDLING:
 * - Uses error_code field from API response
 * - Uses metadata.session_attempts_remaining and global_attempts_remaining from API response
 * - Global warnings take priority over session warnings (more severe)
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

        // Store tokens IMMEDIATELY before callback to avoid race condition
        // Navigation happens sync after callback, so tokens must be in storage first
        secureTokensStorage.setTokens(result.token);

        // Trigger success callback with user only (tokens already stored)
        onSuccess({ user: result.user });

        return true;
      } catch (error: unknown) {
        // Use API-driven error handling
        const {
          translationKey,
          isSessionExpired: expired,
          sessionAttemptsRemaining,
          globalAttemptsRemaining,
        } = getMfaErrorResult(error, type);

        // Handle session expiry (terminal state)
        if (expired && !hasSessionExpiredRef.current) {
          hasSessionExpiredRef.current = true;
          setIsSessionExpired(true);
        }

        // Set display error with priority-based warning
        // Global warnings take priority over session warnings (more severe)
        if (
          globalAttemptsRemaining !== null &&
          globalAttemptsRemaining <= WARNING_THRESHOLD &&
          !expired
        ) {
          // Format: "invalidCode|global|5" for 5 global attempts remaining
          setDisplayError(`${translationKey}|global|${globalAttemptsRemaining}`);
        } else if (
          sessionAttemptsRemaining !== null &&
          sessionAttemptsRemaining <= WARNING_THRESHOLD &&
          !expired
        ) {
          // Format: "invalidCode|session|2" for 2 session attempts remaining
          setDisplayError(`${translationKey}|session|${sessionAttemptsRemaining}`);
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

    // Actions
    verifyCode,
    clearError,
  };
};
