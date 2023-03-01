import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type ActivityItemStore = "text" | "slider" | "radio" | "checkbox"

type ActivityDetails = {
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
}

type ActivityItems = {
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

type ActivityItemAnswer = {
  itemId: string
  answer: Record<string, unknown>
}

export type ActivityState = {
  activityDetails: ActivityDetails | null
  items: Array<ActivityItems> | null
  itemAnswers: Array<ActivityItemAnswer> | null
}

const initialState: ActivityState = {
  activityDetails: null,
  items: null,
  itemAnswers: null,
}

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    saveActivityDetails: (state, action: PayloadAction<ActivityDetails>) => {
      state.activityDetails = action.payload
      return state
    },
    saveActivityItems: (state, action: PayloadAction<ActivityItems[]>) => {
      state.items = action.payload
      return state
    },
    clearActivity: () => {
      return initialState
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
