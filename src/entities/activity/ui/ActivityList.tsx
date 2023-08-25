import Box from "@mui/material/Box"

import { ActivityListItem } from "../lib"
import { ActivityCard } from "./ActivityCard"

interface ActivityListProps {
  activities: ActivityListItem[]
  isPublic: boolean
  onActivityCardClick: (activity: ActivityListItem) => void
}

export const ActivityList = ({ activities, onActivityCardClick, isPublic }: ActivityListProps) => {
  return (
    <Box display="flex" flex={1} flexDirection="column">
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
    </Box>
  )
}
