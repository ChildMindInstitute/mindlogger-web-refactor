import { ActivityListItem } from "../lib"
import { ActivityProgressPreviewCard } from "./ActivityProgressPreviewCard"

interface ActivityProgressPreviewListProps {
  activities: ActivityListItem[]
}

export const ActivityProgressPreviewList = ({ activities }: ActivityProgressPreviewListProps) => {
  const activitiesPreview = activities.map(activity => {
    const itemsLength = activity.items.length
    const currentProgressItem = 0 // TODO: When redux for progress will implemented, add selector to progress activity and get activity order

    return {
      id: activity.activityId,
      title: activity.name,
      progress: (currentProgressItem / itemsLength) * 100,
    }
  })

  return (
    <>
      {activitiesPreview.map(({ id, title, progress }) => (
        <ActivityProgressPreviewCard key={id} title={title} progress={progress} />
      ))}
    </>
  )
}
