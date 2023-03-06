import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { ActivityProgressState, ProgressPayloadState } from "./types"

const initialState: ActivityProgressState = []

const activitySlice = createSlice({
  name: "activityProgress",
  initialState,
  reducers: {
    clearActivity: () => {
      return initialState
    },

    upsertActivityById: (state, action: PayloadAction<ProgressPayloadState>) => {
      const activityIndex = state.findIndex(el => el.activityId === action.payload.activityId)

      if (activityIndex === -1) {
        state.push(action.payload)
        return
      }

      state[activityIndex] = action.payload
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
