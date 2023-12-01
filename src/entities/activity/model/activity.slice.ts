import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import {
  ActivityEventState,
  ClearActivityItemsProgresByIdPayload,
  CompletedEntitiesState,
  CompletedEventEntities,
  GroupsProgressState,
  InProgressEntity,
  SaveActivityItemAnswerPayload,
  SetActivityEventProgressStep,
  SetUserEventByItemIdPayload,
  UpdateUserEventByIndexPayload,
  UpsertActionPayload,
} from "./types"

type InitialActivityState = {
  groupsInProgress: GroupsProgressState
  activityEventProgress: ActivityEventState

  completedEntities: CompletedEntitiesState
  completions: CompletedEventEntities
}

const initialState: InitialActivityState = {
  groupsInProgress: {},
  activityEventProgress: {},
  completedEntities: {},
  completions: {},
}

const activitySlice = createSlice({
  name: "activityProgress",
  initialState,
  reducers: {
    clearActivity: () => {
      return initialState
    },

    clearActivityItemsProgressById: (state, action: PayloadAction<ClearActivityItemsProgresByIdPayload>) => {
      delete state.activityEventProgress[action.payload.activityEventId]
    },

    upsertGroupProgressByParams: (state, action: PayloadAction<UpsertActionPayload>) => {
      const { appletId, activityId, eventId, progressPayload } = action.payload

      state.groupsInProgress[appletId] = state.groupsInProgress[appletId] ?? {}
      state.groupsInProgress[appletId][activityId] = state.groupsInProgress[appletId][activityId] ?? {}
      const group = state.groupsInProgress[appletId][activityId][eventId]
      const updatedProgress = {
        ...group,
        ...progressPayload,
      }

      state.groupsInProgress[appletId][activityId][eventId] = updatedProgress
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
    insertUserEventById: (state, action: PayloadAction<SetUserEventByItemIdPayload>) => {
      const activityEventProgressRecord = state.activityEventProgress[action.payload.activityEventId]

      if (!activityEventProgressRecord) {
        return state
      }

      activityEventProgressRecord.userEvents.push(action.payload.userEvent)
    },
    updateUserEventByIndex: (state, action: PayloadAction<UpdateUserEventByIndexPayload>) => {
      const activityEventProgressRecord = state.activityEventProgress[action.payload.activityEventId]

      if (!activityEventProgressRecord) {
        return state
      }

      if (!activityEventProgressRecord.userEvents[action.payload.userEventIndex]) {
        return state
      }

      activityEventProgressRecord.userEvents[action.payload.userEventIndex] = action.payload.userEvent
    },

    setActivityEventProgressStepByParams: (state, action: PayloadAction<SetActivityEventProgressStep>) => {
      const activityEventProgressRecord = state.activityEventProgress[action.payload.activityEventId]

      activityEventProgressRecord.step = action.payload.step
    },

    entityCompleted: (state, action: PayloadAction<InProgressEntity>) => {
      const { appletId, entityId, eventId } = action.payload

      state.groupsInProgress[appletId][entityId][eventId].endAt = new Date()

      const completedEntities = state.completedEntities ?? {}

      const completions = state.completions ?? {}

      const now = new Date().getTime()

      completedEntities[entityId] = now

      if (!completions[entityId]) {
        completions[entityId] = {}
      }

      const entityCompletions = completions[entityId]

      if (!entityCompletions[eventId]) {
        entityCompletions[eventId] = []
      }
      entityCompletions[eventId].push(now)
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
