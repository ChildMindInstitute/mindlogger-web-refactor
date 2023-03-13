import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { ActivityListItem } from "../lib"

export type ActivityState = Partial<ActivityListItem>

const initialState: ActivityState = {}

const activitySlice = createSlice({
  name: "activityProgress",
  initialState,
  reducers: {
    clearActivity: () => {
      return initialState
    },

    saveSelectedActivity: (state, action: PayloadAction<ActivityState>) => {
      return action.payload
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
