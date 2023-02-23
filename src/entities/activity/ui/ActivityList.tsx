import { ActivityListItem } from "../lib"
import ActivityCard from "./ActivityCard"

interface ActivityListProps {
  activities: ActivityListItem[]
}

const ActivityList = ({ activities }: ActivityListProps) => {
  return (
    <>
      {activities.map(activity => (
        <ActivityCard key={activity.eventId} activity={activity} />
      ))}
    </>
  )
}

export default ActivityList
