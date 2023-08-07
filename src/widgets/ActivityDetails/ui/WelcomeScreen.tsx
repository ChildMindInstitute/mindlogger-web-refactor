import { Typography } from "@mui/material"
import Box from "@mui/material/Box"

import { ActivityAssessmentLayout } from "./ActivityAssessmentLayout"

import { activityModel } from "~/entities/activity"
import { StartAssessmentButton } from "~/features/StartAssessment"
import { ActivityDTO } from "~/shared/api"
import { Theme } from "~/shared/constants"
import { AvatarBase } from "~/shared/ui"
import { useCustomMediaQuery, useCustomTranslation } from "~/shared/utils"

type Props = {
  activityDetails: ActivityDTO
  eventId: string
}

export const ActivityWelcomeScreen = (props: Props) => {
  const { greaterThanSM } = useCustomMediaQuery()
  const { t } = useCustomTranslation()

  const { saveActivityEventRecords } = activityModel.hooks.useSaveActivityEventProgress()

  const startAssessment = () => {
    const initialStep = 1
    return saveActivityEventRecords(props.activityDetails, props.eventId, initialStep)
  }

  return (
    <ActivityAssessmentLayout
      title={props.activityDetails.name}
      activityId={props.activityDetails.id}
      eventId={props.eventId}
      buttons={
        <Box width="100%" display="flex" justifyContent="center">
          <StartAssessmentButton width={greaterThanSM ? "375px" : "335px"} onClick={startAssessment} />
        </Box>
      }>
      <Box height="100%" width="100%" display="flex" justifyContent="center" paddingTop="80px">
        <Box
          id="welcome-screen-activity-details"
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxWidth="570px">
          <AvatarBase
            src={props.activityDetails.image}
            name={props.activityDetails?.name}
            width="124px"
            height="124px"
          />
          <Typography
            variant="body1"
            fontSize="18px"
            fontWeight="400"
            sx={{
              color: Theme.colors.light.secondary,
              marginTop: "24px",
            }}>
            {t("question_count", { length: props.activityDetails.items.length })}
          </Typography>
          <Typography
            variant="body1"
            fontSize="18px"
            fontWeight="700"
            sx={{
              color: Theme.colors.light.onSurface,
              margin: "16px 0px",
            }}>
            {props.activityDetails.name}
          </Typography>

          <Typography
            variant="body1"
            fontSize="18px"
            fontWeight="400"
            textAlign="center"
            sx={{
              color: Theme.colors.light.onSurface,
            }}>
            {props.activityDetails.description}
          </Typography>
        </Box>
      </Box>
    </ActivityAssessmentLayout>
  )
}
