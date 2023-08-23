import { Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

import { useCustomTranslation } from "~/shared/utils"
import { ActivityDetailsWidget } from "~/widgets/ActivityDetails"

export const PublicActivityDetailsPage = () => {
  const { appletId, activityId, eventId, publicAppletKey } = useParams()
  const { t } = useCustomTranslation()

  if (!appletId || !activityId || !eventId || !publicAppletKey) {
    return <div>{t("wrondLinkParametrError")}</div>
  }

  return (
    <Container>
      <ActivityDetailsWidget
        isPublic={true}
        appletId={appletId}
        activityId={activityId}
        eventId={eventId}
        publicAppletKey={publicAppletKey}
      />
    </Container>
  )
}
