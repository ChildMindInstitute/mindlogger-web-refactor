import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

import { MFASessionState, MFASessionAction } from '../model/mfa.types';

/**
 * MFA Session Reducer
 *
 * BACKEND-DRIVEN EXPIRY: No expiresAt field.
 * Backend returns "session expired" errors which useMFAVerification detects.
 */
const mfaSessionReducer = (
  state: MFASessionState | null,
  action: MFASessionAction,
): MFASessionState | null => {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        token: action.payload.token,
        sessionId: action.payload.sessionId,
        loginPassword: action.payload.password,
      };

    case 'CLEAR_SESSION':
      return null;

    default:
      return state;
  }
};

/**
 * MFA Context Value
 */
interface MFAContextValue {
  session: MFASessionState | null;
  setSession: (token: string, sessionId: string, password: string) => void;
  clearSession: () => void;
}

const MFAContext = createContext<MFAContextValue | null>(null);

/**
 * MFA Provider
 *
 * WHY GLOBAL CONTEXT:
 * - Isolates MFA session state from AuthFlow to prevent parent re-renders on MFA errors
 * - Security: Password stored only in React state (memory), never persisted to storage
 * - Session will be cleared after MFA verification completes (success or back to login)
 *
 * WHY PASSWORD IS STORED:
 * - Password is needed for encryption key derivation after MFA succeeds (useOnLogin)
 * - Alternative: Backend could accept userId in MFA verify endpoint to generate key server-side
 * - TODO: Consider API enhancement to pass userId, eliminating need to retain password
 *
 * BACKEND-DRIVEN EXPIRY:
 * - No local expiration timer - backend returns "session expired" errors
 * - useMFAVerification detects expiry from API response
 */
export const MFAProvider = ({ children }: { children: ReactNode }) => {
  const [session, dispatch] = useReducer(mfaSessionReducer, null);

  const setSession = useCallback((token: string, sessionId: string, password: string) => {
    dispatch({
      type: 'SET_SESSION',
      payload: { token, sessionId, password },
    });
  }, []);

  const clearSession = useCallback(() => {
    dispatch({ type: 'CLEAR_SESSION' });
  }, []);

  return (
    <MFAContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </MFAContext.Provider>
  );
};

/**
 * Hook to access MFA context
 */
export const useMFAContext = (): MFAContextValue => {
  const context = useContext(MFAContext);
  if (!context) {
    throw new Error('useMFAContext must be used within MFAProvider');
  }
  return context;
};
