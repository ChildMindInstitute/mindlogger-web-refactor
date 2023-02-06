import { useParams } from "react-router-dom"

import { ActivityListWidget } from "~/widgets/Activity"

const ActivityListPage = () => {
  const { appletId } = useParams()

  if (!appletId) {
    return (
      <div className="applet-error">
        You have reached this URL in error. Please reach out to the organizer of this applet for further assistance.
      </div>
    )
  }

  return <ActivityListWidget appletId={appletId} />
}

export default ActivityListPage
