import { createSlice, PayloadAction } from "@reduxjs/toolkit"
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
      state = { ...state, ...action.payload }
      return state
    },
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
