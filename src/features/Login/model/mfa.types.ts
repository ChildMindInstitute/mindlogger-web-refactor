/**
 * MFA (Multi-Factor Authentication) Type Definitions
 *
 * CRITICAL SECURITY NOTE:
 * MFA session data is stored in-memory only (useReducer), NOT in Redux/localStorage
 * to prevent sensitive data (mfaToken, loginPassword) from being persisted.
 */

// MFA Session stored in-memory (NOT Redux for security)
export interface MFASession {
  /** MFA token from backend login response */
  token: string;
  /** Session identifier for tracking */
  sessionId: string;
  /** Number of failed verification attempts */
  attempts: number;
  /** Unix timestamp for session expiry (5 minutes from creation) */
  expiresAt: number;
  /** CRITICAL: Retained for useOnLogin encryption key derivation */
  loginPassword: string;
}

// AuthFlow state machine states
export type AuthFlowState = 'login' | 'mfa-totp' | 'mfa-recovery';

// MFA verification status
export type MFAVerificationStatus = 'idle' | 'loading' | 'error';

// MFA verification state
export interface MFAVerificationState {
  status: MFAVerificationStatus;
  error?: string;
  /** Formatted error key for display (e.g., 'invalidCode|2' for attempts remaining) */
  displayError?: string;
  isSessionExpired: boolean;
}

// MFA reducer action types
export type MFAAction =
  | {
      type: 'SET_SESSION';
      payload: {
        token: string;
        sessionId: string;
        expiresAt: number;
        password: string;
      };
    }
  | { type: 'CLEAR_SESSION' }
  | { type: 'INCREMENT_ATTEMPTS' }
  | { type: 'SET_VERIFICATION_ERROR'; payload: { error: string; displayError: string } }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_SESSION_EXPIRED' }
  | { type: 'SET_LOADING' }
  | { type: 'SET_IDLE' };

// MFA state (combined for useReducer)
export interface MFAState {
  session: MFASession | null;
  verification: MFAVerificationState;
}

// API response when MFA is required (from login endpoint)
export interface MFARequiredResponse {
  mfaRequired: true;
  mfaToken: string;
  mfaSessionId: string;
}

// Type guard to check if login response requires MFA
export const isMFARequiredResponse = (result: unknown): result is MFARequiredResponse => {
  return (
    typeof result === 'object' &&
    result !== null &&
    'mfaRequired' in result &&
    (result as MFARequiredResponse).mfaRequired === true
  );
};
