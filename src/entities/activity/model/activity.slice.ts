import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type ProgressPayloadState = {
  appletId: string
  activityId: string
  eventId: string
  startAt: Date | null
  endAt: Date | null
}

export type ActivityProgressState = Array<ProgressPayloadState>

const initialState: ActivityProgressState = []

const activitySlice = createSlice({
  name: "activityProgress",
  initialState,
  reducers: {
    clearActivity: () => {
      return initialState
    },

    saveActivityInProgress: (state, action: PayloadAction<ProgressPayloadState>) => {
      state.push(action.payload)
    },
  },
})

export const actions = activitySlice.actions
export const reducer = activitySlice.reducer
