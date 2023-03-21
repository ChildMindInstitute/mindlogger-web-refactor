import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { ProgressState, UpsertActionPayload } from "./types"

type InitialActivityState = {
  groupsInProgress: ProgressState
}

const initialState: InitialActivityState = {
  groupsInProgress: {},
}

const activitySlice = createSlice({
  name: "activityProgress",
  initialState,
  reducers: {
    clearActivity: () => {
      return initialState
    },

    upsertActivityById: (state, action: PayloadAction<UpsertActionPayload>) => {
      const { appletId, activityId, eventId, progressPayload } = action.payload

      state.groupsInProgress[appletId] = state.groupsInProgress[appletId] ?? {}
      state.groupsInProgress[appletId][activityId] = state.groupsInProgress[appletId][activityId] ?? {}
      state.groupsInProgress[appletId][activityId][eventId] = progressPayload
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
