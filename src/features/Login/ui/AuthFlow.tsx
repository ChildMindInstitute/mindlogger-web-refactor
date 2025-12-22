import { useReducer, useState, useCallback } from 'react';

import { LoginForm } from './LoginForm';
import { MFAForm } from './MFAForm';
import { RecoveryCodeForm } from './RecoveryCodeForm';
import {
  MFAState,
  MFAAction,
  AuthFlowState,
  MFARequiredResponse,
  MFASession,
  MFAVerificationState,
} from '../model/mfa.types';

import { userModel } from '~/entities/user';

// Session expiry time: 5 minutes
const MFA_SESSION_EXPIRY_MS = 5 * 60 * 1000;

/**
 * MFA State Reducer
 *
 * CRITICAL SECURITY: This state is IN-MEMORY ONLY (useReducer, NOT Redux)
 * to prevent sensitive data (mfaToken, loginPassword) from being persisted.
 */
const mfaReducer = (state: MFAState, action: MFAAction): MFAState => {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        session: {
          token: action.payload.token,
          sessionId: action.payload.sessionId,
          attempts: 0,
          expiresAt: action.payload.expiresAt,
          loginPassword: action.payload.password,
        } as MFASession,
        verification: { status: 'idle', isSessionExpired: false } as MFAVerificationState,
      };

    case 'CLEAR_SESSION':
      return {
        session: null,
        verification: { status: 'idle', isSessionExpired: false },
      };

    case 'INCREMENT_ATTEMPTS':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          attempts: state.session.attempts + 1,
        },
      };

    case 'SET_VERIFICATION_ERROR':
      return {
        ...state,
        verification: {
          ...state.verification,
          status: 'error',
          error: action.payload.error,
          displayError: action.payload.displayError,
        },
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        verification: {
          ...state.verification,
          status: 'idle',
          error: undefined,
          displayError: undefined,
        },
      };

    case 'SET_SESSION_EXPIRED':
      return {
        ...state,
        verification: {
          status: 'error',
          displayError: 'mfaSessionExpired',
          isSessionExpired: true,
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        verification: { ...state.verification, status: 'loading' },
      };

    case 'SET_IDLE':
      return {
        ...state,
        verification: { status: 'idle', isSessionExpired: false },
      };

    default:
      return state;
  }
};

const initialMFAState: MFAState = {
  session: null,
  verification: { status: 'idle', isSessionExpired: false },
};

interface AuthFlowProps {
  locationState?: Record<string, unknown>;
}

/**
 * AuthFlow Component
 *
 * State machine managing the authentication flow transitions:
 * - 'login'        → Standard login form
 * - 'mfa-totp'     → TOTP verification form
 * - 'mfa-recovery' → Recovery code form
 *
 * Key responsibilities:
 * - Orchestrates flow between login and MFA forms
 * - Manages MFA session state in-memory (security)
 * - Handles post-MFA success with password for encryption
 */
export const AuthFlow = ({ locationState }: AuthFlowProps) => {
  const [flowState, setFlowState] = useState<AuthFlowState>('login');
  const [mfaState, dispatch] = useReducer(mfaReducer, initialMFAState);

  const { onLoginSuccess } = userModel.hooks.useOnLogin({
    backRedirectPath: locationState?.backRedirectPath as string,
  });

  // Handle MFA required response from login
  const handleMFARequired = useCallback((mfaData: MFARequiredResponse, password: string) => {
    dispatch({
      type: 'SET_SESSION',
      payload: {
        token: mfaData.mfaToken,
        sessionId: mfaData.mfaSessionId,
        expiresAt: Date.now() + MFA_SESSION_EXPIRY_MS,
        password, // CRITICAL: Store password for encryption key derivation
      },
    });
    setFlowState('mfa-totp');
  }, []);

  // Handle successful MFA verification
  const handleMFASuccess = useCallback(
    (result: {
      user: { id: string; firstName: string; lastName: string; email: string };
      tokens: { accessToken: string; refreshToken: string; tokenType: string };
      password: string;
    }) => {
      // Call onLoginSuccess with user including password for encryption key derivation
      onLoginSuccess({
        user: {
          ...result.user,
          password: result.password,
        },
        tokens: result.tokens,
      });
    },
    [onLoginSuccess],
  );

  // Navigation handlers
  const handleSwitchToRecovery = useCallback(() => {
    setFlowState('mfa-recovery');
  }, []);

  const handleSwitchToTOTP = useCallback(() => {
    setFlowState('mfa-totp');
  }, []);

  const handleBackToLogin = useCallback(() => {
    dispatch({ type: 'CLEAR_SESSION' });
    setFlowState('login');
  }, []);

  // Render appropriate form based on flow state
  switch (flowState) {
    case 'mfa-totp':
      return (
        <MFAForm
          mfaState={mfaState}
          dispatch={dispatch}
          onSuccess={handleMFASuccess}
          onSwitchToRecovery={handleSwitchToRecovery}
          onBackToLogin={handleBackToLogin}
        />
      );

    case 'mfa-recovery':
      return (
        <RecoveryCodeForm
          mfaState={mfaState}
          dispatch={dispatch}
          onSuccess={handleMFASuccess}
          onSwitchToTOTP={handleSwitchToTOTP}
          onBackToLogin={handleBackToLogin}
        />
      );

    case 'login':
    default:
      return <LoginForm locationState={locationState} onMFARequired={handleMFARequired} />;
  }
};
