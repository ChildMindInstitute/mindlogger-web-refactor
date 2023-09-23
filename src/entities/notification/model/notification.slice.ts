import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type NotificationType = "success" | "error" | "warning" | "info"

export type Notification = {
  id: string
  message: string
  type: NotificationType
  duration: number
  createdAt: number
}

export type NotificationStore = {
  notifications: Notification[]
}

const initialState: NotificationStore = {
  notifications: [],
}

const notificationSlice = createSlice({
  name: "notificationCenter",
  initialState,
  reducers: {
    add(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload)
    },
    removeById(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload)
    },
  },
})

export const actions = notificationSlice.actions
export const reducer = notificationSlice.reducer
