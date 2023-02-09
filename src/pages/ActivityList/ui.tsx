import { useParams } from "react-router-dom"

import { ActivityGroupList } from "~/widgets/Activity"

const ActivityListPage = () => {
  const { appletId } = useParams()

  if (!appletId) {
    return (
      <div className="applet-error">
        You have reached this URL in error. Please reach out to the organizer of this applet for further assistance.
      </div>
    )
  }

  return <ActivityGroupList appletId={appletId} />
}

export default ActivityListPage
