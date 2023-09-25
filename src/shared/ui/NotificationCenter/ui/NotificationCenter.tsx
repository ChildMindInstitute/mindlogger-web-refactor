import { useEffect, useState } from "react"

import Box from "@mui/material/Box"

import { Notification as TNotification } from "../lib/types"
import { Notification } from "./Notification"

import { eventEmitter } from "~/shared/utils"

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<TNotification[]>([])

  const onNotificationAdded = (notification: Record<string, unknown> | undefined) => {
    setNotifications(prev => [...prev, notification as TNotification])
  }

  const onNotificationRemoved = (data: Record<string, unknown> | undefined) => {
    setNotifications(prev => prev.filter(notif => notif.id !== data?.notificationId))
  }

  useEffect(() => {
    eventEmitter.on("onNotificationAdded", onNotificationAdded)
    eventEmitter.on("onNotificationRemoved", onNotificationRemoved)

    return () => {
      eventEmitter.off("onNotificationAdded", onNotificationAdded)
      eventEmitter.off("onNotificationRemoved", onNotificationRemoved)
    }
  }, [])

  return (
    <Box id="app-notification-container" width="100%">
      {notifications.map(data => (
        <Notification key={data.id} id={data.id} message={data.message} type={data.type} duration={data.duration} />
      ))}
    </Box>
  )
}
