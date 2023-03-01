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

export type ActivityItemAnswerState = {
  itemId: string
  answer: Record<string, unknown>
}

export type ActivityState = {
  activityDetails: ActivityDetailsState | null
  itemAnswers: Array<ActivityItemAnswerState> | null
}

const initialState: ActivityState = {
  activityDetails: null,
  itemAnswers: null,
}

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    saveActivityDetails: (state, action: PayloadAction<ActivityDetailsState>) => {
      state.activityDetails = action.payload
      return state
    },
    clearActivity: () => {
      return initialState
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
