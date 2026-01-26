/**
 * MFA (Multi-Factor Authentication) Type Definitions
 *
 * STATE ARCHITECTURE:
 * - MFA session stored in Redux mfa slice (blacklisted from persistence)
 * - Private key derived immediately on MFA required (before navigation)
 * - Error state: Local to useMFAVerification hook, driven by API responses
 *
 * SECURITY MODEL:
 * - Password is used immediately to derive private key, then discarded
 * - MFA tokens stored in Redux only (never persisted to disk)
 * - Lost on page refresh (user restarts MFA flow)
 *
 * BACKEND-DRIVEN EXPIRY:
 * No local expiration tracking. Backend returns "session expired" or
 * "session not found" errors which useMFAVerification detects.
 */

// MFA Session stored in Redux mfa slice (blacklisted from persistence)
export interface MFASession {
  /** MFA token from backend login response */
  mfaToken: string;
  /** Session identifier for tracking */
  mfaSessionId: string;
}

// AuthFlow state machine states
export type AuthFlowState = 'login' | 'mfa-totp' | 'mfa-recovery';

// API response when MFA is required (from login endpoint)
export interface MFARequiredResponse {
  mfaRequired: true;
  mfaToken: string;
  mfaSessionId: string;
  /** User ID - enables immediate private key derivation */
  userId: string;
  /** User email - enables immediate private key derivation */
  userEmail: string;
}

// Type guard to check if login response requires MFA
// Validates ALL required fields to prevent MFA bypass with partial responses
export const isMFARequiredResponse = (result: unknown): result is MFARequiredResponse => {
  if (typeof result !== 'object' || result === null) return false;
  const r = result as Record<string, unknown>;
  return (
    r.mfaRequired === true &&
    typeof r.mfaToken === 'string' &&
    typeof r.mfaSessionId === 'string' &&
    typeof r.userId === 'string' &&
    typeof r.userEmail === 'string'
  );
};
