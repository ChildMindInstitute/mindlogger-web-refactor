import { ActivityListGroup } from "../../lib"
import ActivityGroupsBuildManager from "../services/ActivityGroupsBuildManager"

import { appletModel } from "~/entities/applet"
import { AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"
import { useAppSelector } from "~/shared/utils"

type Props = {
  appletDetails: AppletDetailsDTO
  eventsDetails: AppletEventsResponse
}

type Return = {
  groups: ActivityListGroup[]
}

export const useActivityGroups = ({ appletDetails, eventsDetails }: Props): Return => {
  const groupsInProgress = useAppSelector(appletModel.selectors.groupsInProgressSelector)

  const groupsResult = ActivityGroupsBuildManager.process({
    appletDetails,
    eventsDetails,
    entityProgress: groupsInProgress,
  })

  return {
    groups: groupsResult.groups,
  }
}
