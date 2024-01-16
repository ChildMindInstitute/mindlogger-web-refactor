import Box from "@mui/material/Box"

import { ActivityCard } from "./ActivityCard"
import { ActivityListItem } from "../lib"

type Props = {
  activities: ActivityListItem[]
}

export const ActivityCardList = ({ activities }: Props) => {
  return (
    <Box display="flex" flex={1} flexDirection="column">
      {activities.map(activity => {
        return <ActivityCard key={activity.eventId} activityListItem={activity} />
      })}
    </Box>
  )
}
