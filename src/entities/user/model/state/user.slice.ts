import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { RootState } from "~/shared/utils"

import { UserStore } from "../user.schema"

export const initialState: UserStore = {
  email: undefined,
  emailVerified: undefined,
  admin: undefined,
  lastName: undefined,
  firstName: undefined,
  displayName: undefined,
  creatorId: undefined,
  created: undefined,
  login: undefined,
  otp: undefined,
  public: undefined,
  size: undefined,
  status: undefined,
  _accessLevel: undefined,
  _id: undefined,
  _modelType: undefined,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserStore>) => {
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
