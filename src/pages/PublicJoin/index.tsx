import { useParams } from "react-router-dom"

import { FetchPublicActivityList } from "../../widgets/ActivityGroups"

export const PublicJoinPage = () => {
  const { joinLinkKey } = useParams()

  if (!joinLinkKey) {
    return (
      <div className="applet-error">
        You have reached this URL in error. Please reach out to the organizer of this applet for further assistance.
      </div>
    )
  }

  return <FetchPublicActivityList publicAppletKey={joinLinkKey} />
}
