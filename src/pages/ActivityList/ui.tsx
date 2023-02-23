import { useParams } from "react-router-dom"

import { FetchActivities } from "~/widgets/ActivityGroups"

const ActivityListPage = () => {
  const { appletId } = useParams()

  if (!appletId) {
    return (
      <div className="applet-error">
        You have reached this URL in error. Please reach out to the organizer of this applet for further assistance.
      </div>
    )
  }

  return <FetchActivities isPublic={false} appletId={appletId} />
}

export default ActivityListPage
