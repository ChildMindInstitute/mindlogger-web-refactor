import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import * as activityDetailsModel from "../model"
import { Header } from "./Header"

import { Loader } from "~/shared/ui"
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
    <>
      {activityDetails?.name && (
        <Header activityId={props.activityId} eventId={props.eventId} title={activityDetails.name} />
      )}
      <Container>content</Container>
      <Box>footer</Box>
    </>
  )
}
