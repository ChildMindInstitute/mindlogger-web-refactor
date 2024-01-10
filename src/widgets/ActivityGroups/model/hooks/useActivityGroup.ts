import { ActivityListGroup } from "../../lib"
import ActivityGroupsBuildManager from "../services/ActivityGroupsBuildManager"

import { activityModel } from "~/entities/activity"
import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"
import { useAppSelector } from "~/shared/utils"

type UseActivityGroupsReturn = {
  groups: ActivityListGroup[]
  appletDetails?: AppletDetailsDTO
}

export const useActivityGroups = (
  appletDetails: AppletDetailsDTO,
  eventsDetails: AppletEventsResponse,
): UseActivityGroupsReturn => {
  const groupsInProgress = useAppSelector(activityModel.selectors.groupsInProgressSelector)

  const groupsResult = ActivityGroupsBuildManager.process({
    appletDetails,
    eventsDetails,
    entityProgress: groupsInProgress,
  })

  return {
    groups: groupsResult.groups,
    appletDetails,
  }
}
