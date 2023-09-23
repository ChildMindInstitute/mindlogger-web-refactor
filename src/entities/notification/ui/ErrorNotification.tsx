import ReportRoundedIcon from "@mui/icons-material/ReportRounded"
import Box from "@mui/material/Box"

import { Theme } from "~/shared/constants"
import { Markdown } from "~/shared/ui"

type Props = {
  id: string
  message: string
}

export const ErrorNotification = (props: Props) => {
  return (
    <Box
      id={`error-notification-${props.id}`}
      display="flex"
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="12px"
      gap="12px"
      bgcolor={Theme.colors.light.errorVariant}>
      <ReportRoundedIcon sx={{ color: Theme.colors.light.error }} />
      <Markdown markdown={props.message} />
    </Box>
  )
}
