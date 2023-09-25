import { useEffect } from "react"

import Box from "@mui/material/Box"

import { notificationsSelector } from "../model/selectors"
import { useNotificationCenter } from "../model/useNotificationCenter"
import { Notification } from "./Notification"

import { useAppSelector } from "~/shared/utils"

export const NotificationCenter = () => {
  const notifications = useAppSelector(notificationsSelector)

  const notificationCenter = useNotificationCenter()

  useEffect(() => {
    notifications.forEach(notif => {
      const now = Date.now()
      const dif = now - notif.createdAt

      const timeUntilRemoval = notif.duration - dif

      if (timeUntilRemoval <= 0) {
        notificationCenter.removeNotificationById(notif.id)
      } else {
        setTimeout(() => {
          notificationCenter.removeNotificationById(notif.id)
        }, timeUntilRemoval)
      }
    })
  }, [notificationCenter, notifications])

  return (
    <Box id="app-notification-container" width="100%">
      {notifications.map(data => (
        <Notification key={data.id} id={data.id} message={data.message} type={data.type} duration={data.duration} />
      ))}
    </Box>
  )
}
