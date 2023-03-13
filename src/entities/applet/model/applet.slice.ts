import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type AppletState = {
  id: string | null
  displayName: string | null
  description: string | null
  about: string | null
  image: string | null
  watermark: string | null
}

const initialState: AppletState = {
  id: null,
  displayName: null,
  description: null,
  about: null,
  image: null,
  watermark: null,
}

const appletSlice = createSlice({
  name: "applet",
  initialState,
  reducers: {
    clearAppletState: () => {
      return initialState
    },

    saveSelectedApplet: (state, action: PayloadAction<AppletState>) => {
      return action.payload
    },
  },
})

export const actions = appletSlice.actions
export const reducer = appletSlice.reducer
