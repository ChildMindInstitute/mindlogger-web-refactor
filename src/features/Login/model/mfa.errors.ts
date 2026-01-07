/**
 * MFA Error Constants and Types
 * Matches backend error codes from mindlogger-backend-refactor
 */

// Error codes from backend AUTH.MFA namespace
export const MFA_ERROR_CODES = {
  INVALID_TOTP_CODE: 'AUTH.MFA.INVALID_TOTP_CODE',
  // Note: Backend RecoveryCodeInvalidError has no error_code - used as fallback translation key only
  INVALID_RECOVERY_CODE: 'AUTH.MFA.INVALID_RECOVERY_CODE',
  TOKEN_EXPIRED: 'AUTH.MFA.TOKEN_EXPIRED',
  TOKEN_INVALID: 'AUTH.MFA.TOKEN_INVALID',
  SESSION_NOT_FOUND: 'AUTH.MFA.SESSION_NOT_FOUND',
  TOO_MANY_ATTEMPTS: 'AUTH.MFA.TOO_MANY_ATTEMPTS',
  GLOBAL_LOCKOUT: 'AUTH.MFA.GLOBAL_LOCKOUT',
} as const;

// Error codes that indicate session is expired (terminal state)
export const SESSION_EXPIRED_CODES: string[] = [
  MFA_ERROR_CODES.TOKEN_EXPIRED,
  MFA_ERROR_CODES.TOKEN_INVALID,
  MFA_ERROR_CODES.SESSION_NOT_FOUND,
  MFA_ERROR_CODES.TOO_MANY_ATTEMPTS,
  MFA_ERROR_CODES.GLOBAL_LOCKOUT,
];

// Metadata from API error response
export interface MfaErrorMetadata {
  session_attempts_remaining?: number;
  global_attempts_remaining?: number;
  lockout_reason?: string;
}

// Extended error type for MFA API errors
// Note: Extends BaseError pattern but includes MFA-specific fields
export interface MfaApiError {
  response?: {
    data?: {
      result?: Array<{ message: string }>;
      error_code?: string;
      metadata?: MfaErrorMetadata;
    };
  };
  evaluatedMessage?: string;
  message?: string;
}
