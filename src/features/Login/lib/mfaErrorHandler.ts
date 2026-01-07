import {
  MFA_ERROR_CODES,
  SESSION_EXPIRED_CODES,
  MfaApiError,
  MfaErrorMetadata,
} from '../model/mfa.errors';

export type MfaVerificationType = 'totp' | 'recovery';

export interface MfaErrorResult {
  translationKey: string;
  isSessionExpired: boolean;
  attemptsRemaining: number | null;
}

/**
 * Extract MFA error metadata from API error response
 */
export const extractMfaErrorMetadata = (error: unknown): MfaErrorMetadata | null => {
  try {
    const apiError = error as MfaApiError;
    return apiError?.response?.data?.metadata || null;
  } catch {
    return null;
  }
};

/**
 * Map API error to translation key and determine session expiry
 *
 * Uses backend error_code field instead of string matching.
 * Falls back to generic error messages if error_code is not present.
 */
export const getMfaErrorResult = (error: unknown, type: MfaVerificationType): MfaErrorResult => {
  const apiError = error as MfaApiError;
  const errorCode = apiError?.response?.data?.error_code || '';
  const metadata = extractMfaErrorMetadata(error);

  // Check session expiry from error code
  const isSessionExpired = SESSION_EXPIRED_CODES.includes(errorCode);

  // Get attempts remaining from metadata (prefer session over global)
  const attemptsRemaining = metadata?.session_attempts_remaining ?? null;

  // Map error code to translation key
  let translationKey: string;

  switch (errorCode) {
    case MFA_ERROR_CODES.TOKEN_EXPIRED:
    case MFA_ERROR_CODES.TOKEN_INVALID:
    case MFA_ERROR_CODES.SESSION_NOT_FOUND:
      translationKey = 'mfaSessionExpired';
      break;

    case MFA_ERROR_CODES.TOO_MANY_ATTEMPTS:
    case MFA_ERROR_CODES.GLOBAL_LOCKOUT:
      translationKey = 'tooManyAttempts';
      break;

    case MFA_ERROR_CODES.INVALID_TOTP_CODE:
      translationKey = 'invalidCode';
      break;

    case MFA_ERROR_CODES.INVALID_RECOVERY_CODE:
      translationKey = 'invalidRecoveryCode';
      break;

    default:
      // Fallback for unknown errors or missing error_code
      translationKey = type === 'totp' ? 'invalidCode' : 'invalidRecoveryCode';
  }

  return { translationKey, isSessionExpired, attemptsRemaining };
};
