import { useMemo } from "react"

import { ActivityBase } from "../lib"
import { activityBuilder } from "../model"
import { ActivityProgressPreviewCard } from "./ActivityProgressPreviewCard"

interface ActivityProgressPreviewListProps {
  activities: ActivityBase[]
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
