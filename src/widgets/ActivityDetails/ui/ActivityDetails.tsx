import { useContext } from "react"

import Box from "@mui/material/Box"

import { ActivityDetailsContext } from "../lib"
import * as activityDetailsModel from "../model"
import { AssessmentLoadingScreen } from "./AssessmentLoadingScreen"
import { AssessmentPassingScreen } from "./AssessmentPassingScreen"
import { AssessmentWelcomeScreen } from "./AssessmentWelcomeScreen"

import { appletModel } from "~/entities/applet"
import { useCustomTranslation } from "~/shared/utils"

export const ActivityDetailsWidget = () => {
  const { t } = useCustomTranslation()

  const context = useContext(ActivityDetailsContext)

  const { items } = appletModel.hooks.useActivityEventProgressState({
    eventId: context.eventId,
    activityId: context.activityId,
  })

  const isActivityEventInProgress = items.length > 0

  const { activityDetails, isLoading, isError, error, appletDetails, eventsRawData, respondentMeta } =
    activityDetailsModel.hooks.useActivityDetailsQuery()

  if (isLoading) {
    return <AssessmentLoadingScreen />
  }

  if (isError) {
    return (
      <Box height="100vh" width="100%" display="flex" justifyContent="center" alignItems="center">
        <span>{context.isPublic ? t("additional.invalid_public_url") : error?.evaluatedMessage}</span>
      </Box>
    )
  }

  if (!appletDetails || !activityDetails || !eventsRawData) {
    return (
      <Box height="100vh" width="100%" display="flex" justifyContent="center" alignItems="center">
        <span>{t("common_loading_error")}</span>
      </Box>
    )
  }

  if (!isActivityEventInProgress) {
    return <AssessmentWelcomeScreen activityDetails={activityDetails} />
  }

  return (
    <AssessmentPassingScreen
      appletDetails={appletDetails}
      activityDetails={activityDetails}
      eventsRawData={eventsRawData}
      respondentMeta={respondentMeta}
    />
  )
}
