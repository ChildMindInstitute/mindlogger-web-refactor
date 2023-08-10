import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { SaveAndExitButton } from "./SaveAndExitButton"

import { activityModel } from "~/entities/activity"
import { Theme } from "~/shared/constants"
import { BaseProgressBar } from "~/shared/ui"
import { useCustomMediaQuery, useCustomNavigation } from "~/shared/utils"

type Props = {
  activityId: string
  eventId: string
  title: string
}

export const AssessmentLayoutHeader = (props: Props) => {
  const { greaterThanSM } = useCustomMediaQuery()
  const navigator = useCustomNavigation()

  const { progress } = activityModel.hooks.useActivityEventProgressState({
    activityId: props.activityId,
    eventId: props.eventId,
  })

  const onSaveAndExitClick = () => {
    return navigator.goBack()
  }

  return (
    <Box
      id="activity-details-header"
      display="grid"
      alignItems="center"
      justifyContent="center"
      gridTemplateColumns="1fr minmax(400px, 900px) 1fr"
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
            {props.title}
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
  )
}
