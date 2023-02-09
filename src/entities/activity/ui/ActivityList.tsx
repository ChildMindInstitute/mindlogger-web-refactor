import { ActivityListItem } from "../lib"
import ActivityItem from "./ActivityItem"

interface ActivityListProps {
  activities: ActivityListItem[]
}

const ActivityList = ({ activities }: ActivityListProps) => {
  return <>{activities && activities.map(activity => <ActivityItem key={activity.id} activity={activity} />)}</>
}

export default ActivityList
