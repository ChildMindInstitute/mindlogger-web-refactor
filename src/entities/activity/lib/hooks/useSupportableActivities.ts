import { useMemo } from "react"

import { activityBuilder } from "../../model"
import { useActivitiesByIds } from "./useActivitiesByIds"

import { ActivityDTO, AppletDetailsDTO } from "~/shared/api"

type Props = {
  appletDetails: AppletDetailsDTO
}

export const useSupportableActivities = ({ appletDetails }: Props) => {
  const { data } = useActivitiesByIds({ appletDetails })

  const activities = useMemo(() => {
    return data.filter(x => x) as Array<ActivityDTO>
  }, [data])

  const supportableActivities = useMemo(() => {
    return activityBuilder.checkIsSupportableActivity(activities)
  }, [activities])

  return {
    supportableActivities,
  }
}
