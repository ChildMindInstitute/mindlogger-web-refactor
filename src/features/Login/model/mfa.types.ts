/**
 * MFA (Multi-Factor Authentication) Type Definitions
 *
 * STATE ARCHITECTURE:
 * - MFASessionState: In-memory only (Context), contains security-sensitive data
 * - Error state: Local to useMFAVerification hook, driven by API responses
 *
 * BACKEND-DRIVEN EXPIRY:
 * No local expiration tracking. Backend returns "session expired" or
 * "session not found" errors which useMFAVerification detects.
 */

// MFA Session stored in-memory via Context (NOT Redux for security)
export interface MFASessionState {
  /** MFA token from backend login response */
  token: string;
  /** Session identifier for tracking */
  sessionId: string;
  /** Number of failed verification attempts */
  attempts: number;
  /** CRITICAL: Retained for useOnLogin encryption key derivation */
  loginPassword: string;
}

// AuthFlow state machine states
export type AuthFlowState = 'login' | 'mfa-totp' | 'mfa-recovery';

// MFA session reducer action types (Context state)
export type MFASessionAction =
  | {
      type: 'SET_SESSION';
      payload: {
        token: string;
        sessionId: string;
        password: string;
      };
    }
  | { type: 'CLEAR_SESSION' }
  | { type: 'INCREMENT_ATTEMPTS' };

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
