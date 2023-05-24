import { ActivityListGroup } from "../../lib"
import ActivityGroupsBuildManager from "../services/ActivityGroupsBuildManager"

import { activityModel } from "~/entities/activity"
import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"

type UseActivityGroupsReturn = {
  groups: ActivityListGroup[]
  appletDetails?: AppletDetailsDTO
}

export const useActivityGroups = (
  appletDetails: AppletDetailsDTO,
  eventsDetails: AppletEventsResponse,
): UseActivityGroupsReturn => {
  const { groupsInProgress } = activityModel.hooks.useActivityGroupsInProgressState()

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
