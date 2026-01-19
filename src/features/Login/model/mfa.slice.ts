import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * MFA Redux Slice
 *
 * Stores MFA session in Redux (blacklisted from persistence - never written to disk).
 * Verification state (errors, expiry) is local to useMFAVerification hook.
 */

interface MFASliceState {
  isActive: boolean;
  mfaToken: string | null;
  mfaSessionId: string | null;
}

const initialState: MFASliceState = {
  isActive: false,
  mfaToken: null,
  mfaSessionId: null,
};

const mfaSlice = createSlice({
  name: 'mfa',
  initialState,
  reducers: {
    setMFASession: (state, action: PayloadAction<{ mfaToken: string; mfaSessionId: string }>) => {
      state.isActive = true;
      state.mfaToken = action.payload.mfaToken;
      state.mfaSessionId = action.payload.mfaSessionId;
    },

    clearMFASession: () => initialState,
  },
});

export const mfaActions = mfaSlice.actions;
export const mfaReducer = mfaSlice.reducer;

// Selector
export const selectMFASession = (state: { mfa: MFASliceState }) => {
  if (!state.mfa.mfaToken || !state.mfa.mfaSessionId) return null;
  return { mfaToken: state.mfa.mfaToken, mfaSessionId: state.mfa.mfaSessionId };
};

// Export model
export const mfaModel = {
  reducer: mfaReducer,
  actions: mfaActions,
  selectors: { selectMFASession },
};
