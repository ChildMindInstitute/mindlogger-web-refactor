import { Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

import { useCustomTranslation } from "~/shared/utils"
import { ActivityDetailsWidget } from "~/widgets/ActivityDetails"

export const ActivityDetailsPage = () => {
  const { appletId, activityId, eventId } = useParams()
  const { t } = useCustomTranslation()

  if (!appletId && !activityId && !eventId) {
    return <div>{t("wrondLinkParametrError")}</div>
  }

  return (
    <Container>
      <ActivityDetailsWidget appletId={appletId!} activityId={activityId!} eventId={eventId!} />
    </Container>
  )
}
