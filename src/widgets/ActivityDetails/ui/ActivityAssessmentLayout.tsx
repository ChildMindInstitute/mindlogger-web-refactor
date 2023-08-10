import { PropsWithChildren } from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import { activityModel } from "~/entities/activity"
import { SaveAndExitButton } from "~/features/SaveAssessmentAndExit"
import { Theme } from "~/shared/constants"
import { BaseProgressBar } from "~/shared/ui"
import { useCustomMediaQuery, useCustomNavigation } from "~/shared/utils"

type Props = PropsWithChildren<{
  title: string
  activityId: string
  eventId: string
  buttons: React.ReactNode
}>

export const ActivityAssessmentLayout = ({ children, buttons, activityId, eventId, title }: Props) => {
  const { greaterThanSM } = useCustomMediaQuery()

  const navigator = useCustomNavigation()
  const { progress } = activityModel.hooks.useActivityEventProgressState({
    activityId: activityId,
    eventId: eventId,
  })

  const onSaveAndExitClick = () => {
    return navigator.goBack()
  }

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        id="activity-details-header"
        display="grid"
        alignItems="center"
        justifyContent="center"
        gridTemplateColumns="1fr minmax(400px, 900px) 1fr"
        width="100%"
        padding={greaterThanSM ? "20px 24px" : "0px 16px"}
        gap={1.5}
        sx={{
          backgroundColor: Theme.colors.light.surface,
          borderBottom: `1px solid ${Theme.colors.light.surfaceVariant}`,
        }}>
        <Box width="100%" sx={{ gridColumn: "2 / 3" }}>
          <Box
            display="flex"
            justifyContent={greaterThanSM ? "center" : "space-between"}
            marginBottom={greaterThanSM ? "8px" : "16px"}>
            <Typography
              variant="body1"
              textAlign={greaterThanSM ? "center" : "left"}
              color={Theme.colors.light.onSurface}>
              {title}
            </Typography>
            {!greaterThanSM && <SaveAndExitButton onClick={onSaveAndExitClick} asLink={true} />}
          </Box>
          <BaseProgressBar percentage={progress} />
        </Box>

        {greaterThanSM && (
          <Box
            width="125px"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            justifySelf="flex-end">
            <SaveAndExitButton onClick={onSaveAndExitClick} />
          </Box>
        )}
      </Box>

      <Container sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
        <Box maxWidth="900px">{children}</Box>
      </Container>

      <Box sx={{ borderTop: `1px solid ${Theme.colors.light.surfaceVariant}` }} padding="20px 0px">
        {buttons}
      </Box>
    </Box>
  )
}
