import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface UserStore {
  id: string | number | null
  email: string | null
  fullName: string | null
}

const initialState: UserStore = {
  email: null,
  fullName: null,
  id: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    save: (state, action: PayloadAction<UserStore>) => {
      return action.payload
    },
    clear: () => {
      return initialState
    },
  },
})

export const actions = userSlice.actions
export const reducer = userSlice.reducer
