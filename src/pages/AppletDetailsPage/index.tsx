import { useParams } from "react-router-dom"

import { PageContainer } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"
import { ActivityGroups } from "~/widgets/ActivityGroups"

export const AppletDetailsPage = () => {
  const { appletId } = useParams()
  const { t } = useCustomTranslation()

  if (!appletId) {
    return <div>{t("wrondLinkParametrError")}</div>
  }

  return (
    <PageContainer id="applet-details-page" dataTestId="applet-details-page">
      <ActivityGroups isPublic={false} appletId={appletId} />
    </PageContainer>
  )
}
