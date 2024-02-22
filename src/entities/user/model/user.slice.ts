import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserStore {
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

const initialState: UserStore = {
  id: null,
  email: null,
  firstName: null,
  lastName: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    save: (state, action: PayloadAction<UserStore>) => {
      return action.payload;
    },
    clear: () => {
      return initialState;
    },
  },
});

export const actions = userSlice.actions;
export const reducer = userSlice.reducer;
