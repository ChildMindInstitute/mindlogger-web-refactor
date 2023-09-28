import { Notification } from "./types"

import { eventEmitter } from "~/shared/utils"

export const useNotificationCenter = () => {
  const addNotification = (notification: Notification) => {
    eventEmitter.emit("onNotificationAdded", notification)
  }

  const removeNotificationById = (id: string) => {
    eventEmitter.emit("onNotificationAdded", { notificationId: id })
  }

  return {
    addNotification,
    removeNotificationById,
  }
}
