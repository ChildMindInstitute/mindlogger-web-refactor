import { Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

import { useCustomTranslation } from "~/shared/utils"
import { ActivityDetailsWidget } from "~/widgets/ActivityDetails"

export const PublicActivityDetailsPage = () => {
  const { appletId, entityId, eventId, publicAppletKey } = useParams()
  const { t } = useCustomTranslation()

  if (!appletId || !entityId || !eventId || !publicAppletKey) {
    return <div>{t("wrondLinkParametrError")}</div>
  }

  return (
    <Container>
      <ActivityDetailsWidget
        isPublic={true}
        appletId={appletId}
        activityId={entityId}
        eventId={eventId}
        publicAppletKey={publicAppletKey}
      />
    </Container>
  )
}
