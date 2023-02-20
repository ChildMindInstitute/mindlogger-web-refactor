import { Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

export const ActivityDetailsPage = () => {
  const { appletId, activityId } = useParams()

  return (
    <Container>
      <div>{`${appletId} -- ${activityId}`}</div>
    </Container>
  )
}
