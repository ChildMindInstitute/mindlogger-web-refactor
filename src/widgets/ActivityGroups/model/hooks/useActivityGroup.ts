import { ActivityListGroup } from "../../lib"
import ActivityGroupsBuildManager from "../services/ActivityGroupsBuildManager"

import { activityModel, useCompletedEntitiesQuery } from "~/entities/activity"
import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"
import { getYYYYDDMM } from "~/shared/utils"

type UseActivityGroupsReturn = {
  groups: ActivityListGroup[]
  appletDetails?: AppletDetailsDTO
}

export const useActivityGroups = (
  appletDetails: AppletDetailsDTO,
  eventsDetails: AppletEventsResponse,
): UseActivityGroupsReturn => {
  const { data } = useCompletedEntitiesQuery({
    appletId: appletDetails.id,
    version: appletDetails.version,
    date: getYYYYDDMM(new Date()),
  })

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
