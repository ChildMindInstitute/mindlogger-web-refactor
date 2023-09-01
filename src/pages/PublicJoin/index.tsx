import { useParams } from "react-router-dom"

import { PageContainer } from "~/shared/ui"
import { ActivityGroups } from "~/widgets/ActivityGroups"

export const PublicJoinPage = () => {
  const { joinLinkKey } = useParams()

  if (!joinLinkKey) {
    return (
      <div className="applet-error">
        You have reached this URL in error. Please reach out to the organizer of this applet for further assistance.
      </div>
    )
  }

  return (
    <PageContainer id="public-join-page" dataTestId="public-join-page">
      <ActivityGroups isPublic publicAppletKey={joinLinkKey} />
    </PageContainer>
  )
}
