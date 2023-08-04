import { Typography } from "@mui/material"
import Box from "@mui/material/Box"

import * as activityDetailsModel from "../model"
import { ActivityAssessmentLayout } from "./ActivityAssessmentLayout"

import { StartAssessmentButton } from "~/features/StartAssessment"
import { Theme } from "~/shared/constants"
import { AvatarBase, Loader } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

type PrivateActivityDetailsWidgetProps = {
  isPublic: false

  appletId: string
  activityId: string
  eventId: string
}

type PublicActivityDetailsWidgetProps = {
  isPublic: true

  appletId: string
  activityId: string
  eventId: string

  publicAppletKey: string
}

type WidgetProps = PrivateActivityDetailsWidgetProps | PublicActivityDetailsWidgetProps

export const ActivityWelcomeScreen = (props: WidgetProps) => {
  const { t } = useCustomTranslation()
  const { appletDetails, activityDetails, eventsRawData, isLoading, isError, error } =
    activityDetailsModel.hooks.useActivityDetails(props)

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <Box height="100vh" width="100%" display="flex" justifyContent="center" alignItems="center">
        <span>{props.isPublic ? t("additional.invalid_public_url") : error?.evaluatedMessage}</span>
      </Box>
    )
  }

  return (
    <ActivityAssessmentLayout
      title={activityDetails?.name ?? ""}
      activityId={props.activityId}
      eventId={props.eventId}
      buttons={<StartAssessmentButton />}>
      <Box height="100%" width="100%" display="flex" justifyContent="center" paddingTop="80px">
        <Box
          id="welcome-screen-activity-details"
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxWidth="570px">
          <AvatarBase src={activityDetails?.image} name={activityDetails?.name ?? ""} width="124px" height="124px" />
          <Typography
            variant="body1"
            fontSize="18px"
            fontWeight="400"
            sx={{
              color: Theme.colors.light.secondary,
              marginTop: "24px",
            }}>
            {t("question_count", { length: activityDetails?.items.length ?? "" })}
          </Typography>
          <Typography
            variant="body1"
            fontSize="18px"
            fontWeight="700"
            sx={{
              color: Theme.colors.light.onSurface,
              margin: "16px 0px",
            }}>
            {activityDetails?.name ?? ""}
          </Typography>

          <Typography
            variant="body1"
            fontSize="18px"
            fontWeight="400"
            textAlign="center"
            sx={{
              color: Theme.colors.light.onSurface,
            }}>
            {activityDetails?.description ?? ""}
          </Typography>
        </Box>
      </Box>
    </ActivityAssessmentLayout>
  )
}
