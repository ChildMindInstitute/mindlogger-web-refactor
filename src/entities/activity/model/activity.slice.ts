import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import {
  ActivityEventState,
  GroupsProgressState,
  SaveActivityItemAnswerPayload,
  SetActivityEventProgressStep,
  UpsertActionPayload,
} from "./types"

type InitialActivityState = {
  groupsInProgress: GroupsProgressState
  activityEventProgress: ActivityEventState
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

    saveActivityEventRecords: (state, action: PayloadAction<ActivityEventState>) => {
      state.activityEventProgress = { ...state.activityEventProgress, ...action.payload }
    },

    saveActivityEventAnswerById: (state, action: PayloadAction<SaveActivityItemAnswerPayload>) => {
      const activityEventProgressRecord = state.activityEventProgress[action.payload.activityEventId]

      if (!activityEventProgressRecord) {
        return state
      }

      const itemIndex = activityEventProgressRecord.activityEvents.findIndex(item => item.id === action.payload.itemId)

      activityEventProgressRecord.activityEvents[itemIndex].answer = action.payload.answer
    },

    setActivityEventProgressStepByParams: (state, action: PayloadAction<SetActivityEventProgressStep>) => {
      const activityEventProgressRecord = state.activityEventProgress[action.payload.activityEventId]

      activityEventProgressRecord.step = action.payload.step
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
