import { v4 as uuidv4 } from "uuid"

import { Notification, NotificationType } from "../model"
import { useNotificationCenter } from "../model/useNotificationCenter"

type NotificationParams = {
  message: string
  type: NotificationType
  duration?: number
}

export const useNotification = () => {
  const notificationCenter = useNotificationCenter()

  const showNotification = (params: NotificationParams) => {
    const defaultDuration = 3000

    const notification: Notification = {
      id: uuidv4(),
      message: params.message,
      type: params.type,
      duration: params.duration ?? defaultDuration,
      createdAt: Date.now(),
    }

    notificationCenter.addNotification(notification)

    return setTimeout(() => {
      notificationCenter.removeNotificationById(notification.id)
    }, notification.duration)
  }

  const showSuccessNotification = (msg: string, duration?: number) => {
    return showNotification({ message: msg, type: "success", duration })
  }

  const showWarningNotification = (msg: string, duration?: number) => {
    return showNotification({ message: msg, type: "warning", duration })
  }

  const showErrorNotification = (msg: string, duration?: number) => {
    return showNotification({ message: msg, type: "error", duration })
  }

  const showInfoNotification = (msg: string, duration?: number) => {
    return showNotification({ message: msg, type: "info", duration })
  }

  return {
    showSuccessNotification,
    showWarningNotification,
    showErrorNotification,
    showInfoNotification,
  }
}
