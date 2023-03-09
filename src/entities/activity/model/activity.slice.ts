import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { ProgressState, UpsertActionPayload } from "./types"

const initialState: ProgressState = {}

const activitySlice = createSlice({
  name: "activityProgress",
  initialState,
  reducers: {
    clearActivity: () => {
      return initialState
    },

    upsertActivityById: (state, action: PayloadAction<UpsertActionPayload>) => {
      const { appletId, activityId, eventId, progressPayload } = action.payload

      state[appletId] = state[appletId] ?? {}
      state[appletId][activityId] = state[appletId][activityId] ?? {}
      state[appletId][activityId][eventId] = progressPayload
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
