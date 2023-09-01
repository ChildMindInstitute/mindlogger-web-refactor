import { useParams } from "react-router-dom"

import { PageContainer } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"
import { ActivityDetailsWidget } from "~/widgets/ActivityDetails"

export const PublicActivityDetailsPage = () => {
  const { appletId, activityId, eventId, publicAppletKey } = useParams()
  const { t } = useCustomTranslation()

  if (!appletId || !activityId || !eventId || !publicAppletKey) {
    return <div>{t("wrondLinkParametrError")}</div>
  }

  return (
    <PageContainer id="public-activity-details-page" dataTestId="public-activity-details-page">
      <ActivityDetailsWidget
        isPublic={true}
        appletId={appletId}
        activityId={activityId}
        eventId={eventId}
        publicAppletKey={publicAppletKey}
      />
    </PageContainer>
  )
}
