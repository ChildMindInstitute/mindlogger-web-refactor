import { PropsWithChildren } from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import { AssessmentLayoutFooter } from "./AssessmentLayoutFooter"
import { AssessmentLayoutHeader } from "./AssessmentLayoutHeader"

type Props = PropsWithChildren<{
  title: string

  appletId: string
  activityId: string
  eventId: string
  isPublic: boolean

  buttons: React.ReactNode
}>

export const ActivityAssessmentLayout = ({
  children,
  buttons,
  activityId,
  eventId,
  title,
  appletId,
  isPublic,
}: Props) => {
  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <AssessmentLayoutHeader
        title={title}
        appletId={appletId}
        activityId={activityId}
        eventId={eventId}
        isPublic={isPublic}
      />

      <Container sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
        <Box maxWidth="900px">{children}</Box>
      </Container>

      <AssessmentLayoutFooter>{buttons}</AssessmentLayoutFooter>
    </Box>
  )
}
