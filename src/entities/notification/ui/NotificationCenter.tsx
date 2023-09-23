import Box from "@mui/material/Box"

import { notificationsSelector } from "../model/selectors"
import { Notification } from "./Notification"

import { useAppSelector } from "~/shared/utils"

export const NotificationCenter = () => {
  const notifications = useAppSelector(notificationsSelector)

  return (
    <Box id="app-notification-container" display="flex" width="100%" flexDirection="column">
      {notifications.map(data => (
        <Notification key={data.id} id={data.id} message={data.message} type={data.type} />
      ))}
    </Box>
  )
}
