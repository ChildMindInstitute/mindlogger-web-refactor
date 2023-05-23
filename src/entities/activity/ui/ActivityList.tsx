import { ActivityListItem } from "../lib"
import { ActivityCard } from "./ActivityCard"

interface ActivityListProps {
  activities: ActivityListItem[]
  isPublic: boolean
  onActivityCardClick: (activity: ActivityListItem) => void
}

export const ActivityList = ({ activities, onActivityCardClick, isPublic }: ActivityListProps) => {
  return (
    <>
      {activities.map(activity => {
        return (
          <ActivityCard
            key={activity.eventId}
            activity={activity}
            onActivityCardClick={() => onActivityCardClick(activity)}
            isPublic={isPublic}
          />
        )
      })}
    </>
  )
}
