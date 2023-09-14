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
  publicKey: string | null

  buttons: React.ReactNode
  onKeyDownHandler?: (key: string) => void
}>

export const ActivityAssessmentLayout = ({
  children,
  buttons,
  activityId,
  eventId,
  title,
  appletId,
  isPublic,
  onKeyDownHandler,
  publicKey,
}: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      flex={1}
      height="100svh"
      onKeyDown={event => onKeyDownHandler && onKeyDownHandler(event.key)}>
      <AssessmentLayoutHeader
        title={title}
        appletId={appletId}
        activityId={activityId}
        eventId={eventId}
        isPublic={isPublic}
        publicKey={publicKey}
      />

      <Container sx={{ display: "flex", flex: 1, justifyContent: "center", overflow: "scroll" }}>
        <Box maxWidth="900px">{children}</Box>
      </Container>

      <AssessmentLayoutFooter>{buttons}</AssessmentLayoutFooter>
    </Box>
  )
}
