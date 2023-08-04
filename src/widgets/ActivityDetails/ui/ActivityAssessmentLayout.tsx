import { PropsWithChildren } from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import { SaveAndExitButton } from "./SaveAndExitButton"

import { activityModel } from "~/entities/activity"
import { Theme } from "~/shared/constants"
import { BaseProgressBar } from "~/shared/ui"
import { useCustomNavigation } from "~/shared/utils"

type Props = PropsWithChildren<{
  title: string
  activityId: string
  eventId: string
  buttons: React.ReactNode
}>

export const ActivityAssessmentLayout = ({ children, buttons, activityId, eventId, title }: Props) => {
  const navigator = useCustomNavigation()
  const { progress } = activityModel.hooks.useActivityEventProgressState({
    activityId: activityId,
    eventId: eventId,
  })

  const onSaveAndExitClick = () => {
    return navigator.goBack()
  }

  return (
    <Box height="100%" sx={{ display: "grid", gridTemplateRows: "80px 1fr 72px", alignItems: "stretch" }}>
      <Box
        id="activity-details-header"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        position="relative"
        sx={{
          backgroundColor: Theme.colors.light.surface,
          borderBottom: `1px solid ${Theme.colors.light.surfaceVariant}`,
        }}>
        <Box width="570px">
          <Typography
            variant="body1"
            textAlign="center"
            color={Theme.colors.light.onSurface}
            sx={{ marginBottom: "8px" }}>
            {title}
          </Typography>
          <BaseProgressBar percentage={progress} />
        </Box>

        <SaveAndExitButton onClick={onSaveAndExitClick} />
      </Box>

      <Container>{children}</Container>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
        sx={{ borderTop: `1px solid ${Theme.colors.light.surfaceVariant}` }}>
        {buttons}
      </Box>
    </Box>
  )
}
