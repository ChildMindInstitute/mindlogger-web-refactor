import { ActivityListItem } from "../lib"
import { SupportableActivities } from "../model/types"
import { ActivityCard } from "./ActivityCard"

interface ActivityListProps {
  activities: ActivityListItem[]
  supportableActivities: SupportableActivities
  onActivityCardClick: (activity: ActivityListItem) => void
}

export const ActivityList = ({ activities, onActivityCardClick, supportableActivities }: ActivityListProps) => {
  return (
    <>
      {activities.map(activity => {
        return (
          <ActivityCard
            key={activity.eventId}
            activity={activity}
            isSupported={supportableActivities[activity.activityId]}
            onActivityCardClick={() => onActivityCardClick(activity)}
          />
        )
      })}
    </>
  )
}
