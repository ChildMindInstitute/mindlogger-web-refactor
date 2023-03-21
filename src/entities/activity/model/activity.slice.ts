import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { ActivityEventProgressState, GroupsProgressState, UpsertActionPayload } from "./types"

type InitialActivityState = {
  groupsInProgress: GroupsProgressState
  activityEventProgress: ActivityEventProgressState
}

const initialState: InitialActivityState = {
  groupsInProgress: {},
  activityEventProgress: {},
}

const activitySlice = createSlice({
  name: "activityProgress",
  initialState,
  reducers: {
    clearActivity: () => {
      return initialState
    },

    upsertGroupProgressByParams: (state, action: PayloadAction<UpsertActionPayload>) => {
      const { appletId, activityId, eventId, progressPayload } = action.payload

      state.groupsInProgress[appletId] = state.groupsInProgress[appletId] ?? {}
      state.groupsInProgress[appletId][activityId] = state.groupsInProgress[appletId][activityId] ?? {}
      state.groupsInProgress[appletId][activityId][eventId] = progressPayload
    },

    saveActivityEventRecords: (state, action: PayloadAction<ActivityEventProgressState>) => {
      state.activityEventProgress = { ...state.activityEventProgress, ...action.payload }
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
