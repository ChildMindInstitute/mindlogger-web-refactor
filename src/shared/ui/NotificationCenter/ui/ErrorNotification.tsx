import { forwardRef } from "react"

import ReportRoundedIcon from "@mui/icons-material/ReportRounded"
import Box from "@mui/material/Box"

import { Theme } from "~/shared/constants"
import { Markdown } from "~/shared/ui"

type Props = {
  id: string
  message: string
  duration: number
}

export const ErrorNotification = forwardRef((props: Props, ref) => {
  return (
    <Box
      ref={ref}
      id={`error-notification-${props.id}`}
      display="flex"
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="12px 16px"
      gap="12px"
      minHeight="72px"
      bgcolor={Theme.colors.light.errorVariant}>
      <ReportRoundedIcon sx={{ color: Theme.colors.light.error }} />
      <Markdown markdown={props.message} />
    </Box>
  )
})
