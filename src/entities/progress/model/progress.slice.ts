import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { ProgressState, UpsertActionPayload } from "./types"

const initialState: ProgressState = {}

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    clearAllProgress: () => {
      return initialState
    },

    upsertProgressByParams: (state, action: PayloadAction<UpsertActionPayload>) => {
      const { appletId, activityId, eventId, progressPayload } = action.payload

      state[appletId] = state[appletId] ?? {}
      state[appletId][activityId] = state[appletId][activityId] ?? {}
      state[appletId][activityId][eventId] = progressPayload
    },
  },
})

export const actions = progressSlice.actions
export const reducer = progressSlice.reducer
