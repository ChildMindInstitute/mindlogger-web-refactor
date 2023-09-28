import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import Box from "@mui/material/Box"

import { Theme } from "~/shared/constants"
import { Markdown } from "~/shared/ui"

type Props = {
  id: string
  message: string
  duration: number
}

export const SuccessNotification = (props: Props) => {
  return (
    <Box
      id={`success-notification-${props.id}`}
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding="12px"
      gap="12px"
      bgcolor={Theme.colors.light.accentGreen30}>
      <CheckCircleRoundedIcon sx={{ color: Theme.colors.light.accentGreen }} />
      <Markdown markdown={props.message} />
    </Box>
  )
}
