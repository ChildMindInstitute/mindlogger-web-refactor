import Box from "@mui/material/Box"

import { activityModel } from "~/entities/activity"
import { SaveAndExitButton } from "~/features/SaveAssessmentAndExit"
import { Theme } from "~/shared/constants"
import { BaseProgressBar, Text } from "~/shared/ui"
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

  const cutStringToLength = (str: string, length: number) => {
    return str.length > length ? `${str.substring(0, length)}...` : str
  }

  return (
    <Box
      id="activity-details-header"
      display="grid"
      alignItems="center"
      justifyContent="center"
      gridTemplateColumns="1fr minmax(300px, 900px) 1fr"
      padding={greaterThanSM ? "19px 24px" : "15px 16px"}
      gap={1.5}
      sx={{
        backgroundColor: Theme.colors.light.surface,
        borderBottom: `1px solid ${Theme.colors.light.surfaceVariant}`,
      }}>
      <Box sx={{ gridColumn: "2 / 3" }}>
        <Box
          display="flex"
          justifyContent={greaterThanSM ? "center" : "space-between"}
          marginBottom={greaterThanSM ? "8px" : "16px"}>
          <Text color={Theme.colors.light.onSurface} sx={{ textAlign: greaterThanSM ? "center" : "left" }}>
            {greaterThanSM ? props.title : cutStringToLength(props.title, 30)}
          </Text>
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
