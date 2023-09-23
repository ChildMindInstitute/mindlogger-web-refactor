import Box from "@mui/material/Box"

import { NotificationType } from "../model"

import { Theme } from "~/shared/constants"
import { Markdown } from "~/shared/ui"

type Props = {
  id: string
  message: string
  type: NotificationType
}

export const Notification = ({ id, message, type }: Props) => {
  const applyBgColor = (type: NotificationType) => {
    switch (type) {
      case "success":
        return Theme.colors.light.accentGreen
      case "error":
        return Theme.colors.light.accentOrange
      case "warning":
        return Theme.colors.light.accentYellow
      case "info":
        return Theme.colors.light.primary008
      default:
        return Theme.colors.light.accentGreen
    }
  }

  return (
    <Box
      id={`notification-${id}`}
      display="flex"
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="12px"
      bgcolor={applyBgColor(type)}>
      <Markdown markdown={message} />
    </Box>
  )
}
