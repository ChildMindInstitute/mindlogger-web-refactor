import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import * as activityDetailsModel from "../model"
import { Footer } from "./Footer"
import { Header } from "./Header"

import { Loader } from "~/shared/ui"
import { Theme, useCustomTranslation } from "~/shared/utils"

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
    <Box height="100%" sx={{ display: "grid", gridTemplateRows: "80px 1fr 72px", alignItems: "stretch" }}>
      {activityDetails?.name && (
        <Header activityId={props.activityId} eventId={props.eventId} title={activityDetails.name} />
      )}
      <Container>content</Container>
      <Footer>
        <ButtonBase
          sx={{
            padding: "10px 24px",
            backgroundColor: Theme.colors.light.primary,
            width: "375px",
            borderRadius: "100px",
          }}>
          <Typography variant="body1" color={Theme.colors.light.onPrimary} fontSize="14px" fontWeight="700">
            Start
          </Typography>
        </ButtonBase>
      </Footer>
    </Box>
  )
}
