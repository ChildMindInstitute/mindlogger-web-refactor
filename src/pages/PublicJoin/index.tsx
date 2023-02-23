import { useParams } from "react-router-dom"

import { FetchActivities } from "../../widgets/ActivityGroups"

export const PublicJoinPage = () => {
  const { joinLinkKey } = useParams()

  if (!joinLinkKey) {
    return (
      <div className="applet-error">
        You have reached this URL in error. Please reach out to the organizer of this applet for further assistance.
      </div>
    )
  }

  return <FetchActivities isPublic={true} publicAppletKey={joinLinkKey} />
}
