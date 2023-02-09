import { Activity } from "../lib"
import ActivityCard from "./ActivityItem"

interface ActivityListProps {
  activities: Activity[]
}

const ActivityList = ({ activities }: ActivityListProps) => {
  return (
    <>
      {activities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </>
  )
}

export default ActivityList
