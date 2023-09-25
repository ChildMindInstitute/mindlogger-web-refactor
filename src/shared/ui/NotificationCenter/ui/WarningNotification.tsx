import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded"
import Box from "@mui/material/Box"

import { NotificationAnimation } from "./NotificationAnimation"

import { Theme } from "~/shared/constants"
import { Markdown } from "~/shared/ui"

type Props = {
  id: string
  message: string
  duration: number
}

export const WarningNotification = (props: Props) => {
  return (
    <NotificationAnimation notificationLifeTime={props.duration} animationDuration={350}>
      <Box
        id={`warning-notification-${props.id}`}
        display="flex"
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="12px 16px"
        gap="12px"
        bgcolor={Theme.colors.light.accentYellow30}>
        <ErrorRoundedIcon sx={{ color: Theme.colors.light.accentYellow }} />
        <Markdown markdown={props.message} />
      </Box>
    </NotificationAnimation>
  )
}
