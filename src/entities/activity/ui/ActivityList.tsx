import { ActivityListItem } from "../lib"
import ActivityCard from "./ActivityCard"

interface ActivityListProps {
  activities: ActivityListItem[]
  onActivityCardClick: (activityId: string) => void
}

const ActivityList = ({ activities, onActivityCardClick }: ActivityListProps) => {
  return (
    <>
      {activities.map(activity => (
        <ActivityCard
          key={activity.eventId}
          activity={activity}
          onActivityCardClick={() => onActivityCardClick(activity.activityId)}
        />
      ))}
    </>
  )
}

export default ActivityList
