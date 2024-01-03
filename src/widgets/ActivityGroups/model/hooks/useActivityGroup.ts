import { ActivityListGroup } from "../../lib"
import ActivityGroupsBuildManager from "../services/ActivityGroupsBuildManager"

import { appletModel } from "~/entities/applet"
import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"

type UseActivityGroupsParams = {
  appletDetails: AppletDetailsDTO
  eventsDetails: AppletEventsResponse
}

type UseActivityGroupsReturn = {
  groups: ActivityListGroup[]
  appletDetails?: AppletDetailsDTO
}

export const useActivityGroups = (props: UseActivityGroupsParams): UseActivityGroupsReturn => {
  const { groupsInProgress } = appletModel.hooks.useActivityGroupsInProgressState()

  const groupsResult = ActivityGroupsBuildManager.process({
    appletDetails: props.appletDetails,
    eventsDetails: props.eventsDetails,
    entityProgress: groupsInProgress,
  })

  return {
    groups: groupsResult.groups,
    appletDetails: props.appletDetails,
  }
}
