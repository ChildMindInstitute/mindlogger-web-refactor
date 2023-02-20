import { Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

import { ActivityDetailsWidget } from "~/widgets/ActivityDetails"

export const ActivityDetailsPage = () => {
  const { appletId, activityId } = useParams()

  return (
    <Container>
      {appletId && activityId && <ActivityDetailsWidget appletId={appletId} activityId={activityId} />}
    </Container>
  )
}
