import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "~/app/store"

import { TUserAuthSchema } from "./interface"

export type TAuthUserState = TUserAuthSchema

export const initialState: TUserAuthSchema = {
  token: undefined,
  expires: undefined,
  scope: [],
}

export const authUserSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<TAuthUserState>) => {
      state = { ...state, ...action.payload }
      return state
    },
  },
})

export const userAuthSelector = (state: RootState) => state.auth
export const authToken = createSelector(userAuthSelector, auth => auth.token)
export const authTokenScope = createSelector(userAuthSelector, auth => auth.scope)
export const authTokenExpires = createSelector(userAuthSelector, auth => auth.expires)

export const { setAuth } = authUserSlice.actions

export default authUserSlice.reducer
