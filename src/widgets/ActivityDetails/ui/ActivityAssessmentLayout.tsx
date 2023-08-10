import { PropsWithChildren } from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import { AssessmentLayoutFooter } from "./AssessmentLayoutFooter"
import { AssessmentLayoutHeader } from "./AssessmentLayoutHeader"

type Props = PropsWithChildren<{
  title: string
  activityId: string
  eventId: string
  buttons: React.ReactNode
}>

export const ActivityAssessmentLayout = ({ children, buttons, activityId, eventId, title }: Props) => {
  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <AssessmentLayoutHeader activityId={activityId} eventId={eventId} title={title} />

      <Container sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
        <Box maxWidth="900px">{children}</Box>
      </Container>

      <AssessmentLayoutFooter>{buttons}</AssessmentLayoutFooter>
    </Box>
  )
}
