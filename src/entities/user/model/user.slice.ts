import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { RootState } from "~/app/store"

import { TUserStateSchema } from "./interface"

export type UserState = TUserStateSchema

export const initialState: UserState = {
  email: undefined,
  emailVerified: undefined,
  admin: undefined,
  lastName: undefined,
  firstName: undefined,
  displayName: undefined,
  creatorId: undefined,
  created: undefined,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload }
    },
    clearUser: () => {
      return initialState
    },
  },
})

export const userSelector = (state: RootState) => state.user

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
