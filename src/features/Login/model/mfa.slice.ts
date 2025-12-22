import { createSlice } from '@reduxjs/toolkit';

/**
 * MFA Redux Slice
 *
 * SIMPLIFIED: Only handles reset action for AuthFlow state machine.
 * All MFA verification state (errors, session expiry) is now local to useMFAVerification hook.
 * API responses drive error display - no Redux needed for MFA errors.
 */

interface MFASliceState {
  // Minimal state - just a flag to track if MFA flow is active
  isActive: boolean;
}

const initialState: MFASliceState = {
  isActive: false,
};

const mfaSlice = createSlice({
  name: 'mfa',
  initialState,
  reducers: {
    setMFAActive: (state) => {
      state.isActive = true;
    },

    resetMFA: () => initialState,
  },
});

export const mfaActions = mfaSlice.actions;
export const mfaReducer = mfaSlice.reducer;

// Export model
export const mfaModel = {
  reducer: mfaReducer,
  actions: mfaActions,
};
