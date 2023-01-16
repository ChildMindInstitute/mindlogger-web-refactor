import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"

import { RootState } from "~/shared/utils"

import { Authorization } from "../user.schema"

export const initialState: Authorization = {
  accessToken: undefined,
  refreshToken: undefined,
  tokenType: undefined,
}

export const authUserSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<Authorization>) => {
      return { ...state, ...action.payload }
    },
    clearAuth: () => {
      return initialState
    },
  },
})

export const userAuthSelector = (state: RootState) => state.auth
export const authToken = createSelector(userAuthSelector, auth => auth.accessToken)
export const authRefreshToken = createSelector(userAuthSelector, auth => auth.refreshToken)
export const authTokenType = createSelector(userAuthSelector, auth => auth.tokenType)

export const { setAuth, clearAuth } = authUserSlice.actions

export default authUserSlice.reducer
