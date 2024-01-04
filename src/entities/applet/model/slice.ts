import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidV4 } from "uuid"

import {
  ProgressState,
  RemoveActivityProgressPayload,
  CompletedEntitiesState,
  CompletedEventEntities,
  InProgressActivity,
  InProgressEntity,
  InProgressFlow,
  SaveActivityItemAnswerPayload,
  SaveActivityProgressPayload,
  SetUserEventByItemIdPayload,
  UpdateStepPayload,
  UpdateUserEventByIndexPayload,
  UpsertActionPayload,
} from "./types"

import {
  ActivityPipelineType,
  EventProgressState,
  FlowProgress,
  getActivityEventProgressId,
  GroupProgress,
} from "~/abstract/lib"

type InitialState = {
  groupsInProgress: GroupProgress
  progress: ProgressState
  completedEntities: CompletedEntitiesState
  completions: CompletedEventEntities
}

const initialState: InitialState = {
  groupsInProgress: {},
  progress: {},
  completedEntities: {},
  completions: {},
}

const appletsSlice = createSlice({
  name: "applets",
  initialState,
  reducers: {
    resetAppletsStore: () => {
      return initialState
    },

    removeActivityProgress: (state, action: PayloadAction<RemoveActivityProgressPayload>) => {
      const id = getActivityEventProgressId(action.payload.activityId, action.payload.eventId)

      delete state.progress[id]
    },

    insertGroupProgressByParams: (state, action: PayloadAction<UpsertActionPayload>) => {
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

    saveActivityProgress: (state, action: PayloadAction<SaveActivityProgressPayload>) => {
      const id = getActivityEventProgressId(action.payload.activityId, action.payload.eventId)

      state.progress[id] = action.payload.progress
    },

    saveActivityEventAnswerById: (state, action: PayloadAction<SaveActivityItemAnswerPayload>) => {
      const activityProgress = state.progress[action.payload.activityEventId]

      if (!activityProgress) {
        return state
      }

      const itemIndex = activityProgress.items.findIndex(item => item.id === action.payload.itemId)

      activityProgress.items[itemIndex].answer = action.payload.answer
    },
    insertUserEventById: (state, action: PayloadAction<SetUserEventByItemIdPayload>) => {
      const activityProgress = state.progress[action.payload.activityEventId]

      if (!activityProgress) {
        return state
      }

      activityProgress.userEvents.push(action.payload.userEvent)
    },
    updateUserEventByIndex: (state, action: PayloadAction<UpdateUserEventByIndexPayload>) => {
      const activityProgress = state.progress[action.payload.activityEventId]

      if (!activityProgress) {
        return state
      }

      if (!activityProgress.userEvents[action.payload.userEventIndex]) {
        return state
      }

      activityProgress.userEvents[action.payload.userEventIndex] = action.payload.userEvent
    },

    incrementStep: (state, action: PayloadAction<UpdateStepPayload>) => {
      const id = getActivityEventProgressId(action.payload.activityId, action.payload.eventId)

      const activityProgress = state.progress[id]

      activityProgress.step += 1
    },

    decrementStep: (state, action: PayloadAction<UpdateStepPayload>) => {
      const id = getActivityEventProgressId(action.payload.activityId, action.payload.eventId)

      const activityProgress = state.progress[id]

      activityProgress.step -= 1
    },

    activityStarted: (state, action: PayloadAction<InProgressActivity>) => {
      const { appletId, activityId, eventId } = action.payload

      const activityEvent: EventProgressState = {
        type: ActivityPipelineType.Regular,
        startAt: new Date().getTime(),
        endAt: null,
      }

      state.groupsInProgress[appletId] = state.groupsInProgress[appletId] ?? {}
      state.groupsInProgress[appletId][activityId] = state.groupsInProgress[appletId][activityId] ?? {}
      state.groupsInProgress[appletId][activityId][eventId] = activityEvent
    },
    flowStarted: (state, action: PayloadAction<InProgressFlow>) => {
      const { appletId, activityId, flowId, eventId, pipelineActivityOrder } = action.payload

      const flowEvent: EventProgressState = {
        type: ActivityPipelineType.Flow,
        currentActivityId: activityId,
        startAt: new Date().getTime(),
        currentActivityStartAt: new Date().getTime(),
        endAt: null,
        executionGroupKey: uuidV4(),
        pipelineActivityOrder,
      }

      state.groupsInProgress[appletId] = state.groupsInProgress[appletId] ?? {}
      state.groupsInProgress[appletId][flowId] = state.groupsInProgress[appletId][flowId] ?? {}

      state.groupsInProgress[appletId][flowId][eventId] = flowEvent
    },

    flowUpdated: (state, action: PayloadAction<InProgressFlow>) => {
      const { appletId, activityId, flowId, eventId, pipelineActivityOrder } = action.payload

      const event = state.groupsInProgress[appletId][flowId][eventId] as FlowProgress

      event.currentActivityId = activityId
      event.pipelineActivityOrder = pipelineActivityOrder
      event.currentActivityStartAt = new Date().getTime()
    },

    entityCompleted: (state, action: PayloadAction<InProgressEntity>) => {
      const { appletId, entityId, eventId } = action.payload

      state.groupsInProgress[appletId][entityId][eventId].endAt = new Date().getTime()

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

export const actions = appletsSlice.actions
export const reducer = appletsSlice.reducer
