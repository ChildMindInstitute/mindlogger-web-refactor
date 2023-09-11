import Box from "@mui/material/Box"

import * as activityDetailsModel from "../model"
import { AssessmentPassingScreen } from "./AssessmentPassingScreen"
import { AssessmentWelcomeScreen } from "./AssessmentWelcomeScreen"

import { Loader } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

type PrivateActivityAssessmentProps = {
  isPublic: false

  appletId: string
  activityId: string
  eventId: string
}

type PublicActivityAssessmentProps = {
  isPublic: true

  appletId: string
  activityId: string
  eventId: string

  publicAppletKey: string
}

type Props = PrivateActivityAssessmentProps | PublicActivityAssessmentProps

export const ActivityDetailsWidget = (props: Props) => {
  const { t } = useCustomTranslation()

  const {
    activityDetails,
    isLoading,
    isError,
    error,
    isActivityEventInProgress,
    appletDetails,
    eventsRawData,
    respondentMeta,
  } = activityDetailsModel.hooks.useActivityDetails(props)

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

  if (!appletDetails || !activityDetails || !eventsRawData) {
    return (
      <Box height="100vh" width="100%" display="flex" justifyContent="center" alignItems="center">
        <span>{t("common_loading_error")}</span>
      </Box>
    )
  }

  if (!isActivityEventInProgress && activityDetails) {
    return (
      <AssessmentWelcomeScreen
        activityDetails={activityDetails}
        eventId={props.eventId}
        appletId={appletDetails.id}
        isPublic={props.isPublic}
        publicKey={props.isPublic ? props.publicAppletKey : null}
      />
    )
  }

  return (
    <>
      <AssessmentPassingScreen
        appletDetails={appletDetails}
        activityDetails={activityDetails}
        eventsRawData={eventsRawData}
        eventId={props.eventId}
        isPublic={props.isPublic}
        publicAppletKey={props.isPublic ? props.publicAppletKey : undefined}
        respondentMeta={respondentMeta}
      />
    </>
  )
}
