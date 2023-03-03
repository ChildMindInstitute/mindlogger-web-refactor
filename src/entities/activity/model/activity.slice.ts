import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type ActivityItemStore = "text" | "slider" | "radio" | "checkbox"

export type ActivityDetailsState = {
  id: string
  name: string
  description: string
  image: string
  splashScreen: string
  showAllAtOnce: boolean
  isSkippable: boolean
  isReviewable: boolean
  responseIsEditable: boolean
  ordering: number
  items: Array<ActivityItemsState> | null
}

export type ActivityItemsState = {
  id: string
  question: string
  responseType: ActivityItemStore
  timer: number
  isSkippable: boolean
  isRandom: boolean
  isAbleToMoveToPrevious: boolean
  hasTextResponse: boolean
  ordering: number
}

export type ActivityItemWithAnswerState = ActivityItemsState & {
  answer: Record<string, unknown> | null
}

export type ActivityProgressState = {
  startAt: Date | null
  endAt: Date | null
  items: ActivityItemWithAnswerState[]
}

export type ActivityIdType = string

export type ActivityState = {
  activitiesInProgress: Record<ActivityIdType, ActivityProgressState> // Activity Progress Example: { activityId: [ActivityItemProgressState] }
  activityDetails: ActivityDetailsState | null
}

const initialState: ActivityState = {
  activitiesInProgress: {},
  activityDetails: null,
}

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    saveActivityDetails: (state, action: PayloadAction<ActivityDetailsState>) => {
      state.activityDetails = action.payload
    },
    clearActivity: () => {
      return initialState
    },

    saveActivityInProgress: (
      state,
      action: PayloadAction<{ activityId: string; items: ActivityItemWithAnswerState[] }>,
    ) => {
      let activityInProgressById = state.activitiesInProgress[action.payload.activityId]

      if (!activityInProgressById) {
        activityInProgressById = { items: [], startAt: new Date(), endAt: null }
      }
      activityInProgressById.items = action.payload.items

      return state
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
