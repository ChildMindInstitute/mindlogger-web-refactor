import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type AppletState = Partial<{
  id: string
  displayName: string
  description: string
  about: string
  image: string | null
  watermark: string | null
}>

const initialState: AppletState = {}

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
