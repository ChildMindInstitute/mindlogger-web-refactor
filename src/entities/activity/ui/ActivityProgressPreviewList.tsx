import { ActivityListItem } from "../lib"
import { getRandomInt } from "../lib/getRandomInt"
import { ActivityProgressPreviewCard } from "./ActivityProgressPreviewCard"

interface ActivityProgressPreviewListProps {
  activities: ActivityListItem[]
}

export const ActivityProgressPreviewList = ({ activities }: ActivityProgressPreviewListProps) => {
  const activitiesPreview = activities.map(activity => {
    const itemsLength = 10 // activity.items.length in the real implementation
    const currentProgressItem = getRandomInt(10) // TODO: When redux for progress will implemented, add selector to progress activity and get activity order

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
