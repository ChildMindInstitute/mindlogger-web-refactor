import { useMemo } from "react"

import { ActivityListItem } from "../lib"
import activityBuilder from "../model/activityBuilder"
import { ActivityProgressPreviewCard } from "./ActivityProgressPreviewCard"

interface ActivityProgressPreviewListProps {
  activities: ActivityListItem[]
}

export const ActivityProgressPreviewList = ({ activities }: ActivityProgressPreviewListProps) => {
  const activitiesPreview = useMemo(() => activityBuilder.convertToActivityProgressPreview(activities), [activities])

  return (
    <>
      {activitiesPreview.map(({ id, title, progress }) => (
        <ActivityProgressPreviewCard key={id} title={title} progress={progress} />
      ))}
    </>
  )
}
