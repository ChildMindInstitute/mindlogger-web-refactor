import { ActivityGroupsBuildManager } from "../services/ActivityGroupsBuildManager"

import { ActivityListGroup } from "~/abstract/lib/GroupBuilder"
import { appletModel } from "~/entities/applet"
import { AppletDetailsBaseInfoDTO, AppletEventsResponse } from "~/shared/api"
import { useAppSelector } from "~/shared/utils"

type Props = {
  applet: AppletDetailsBaseInfoDTO
  events: AppletEventsResponse
}

type Return = {
  groups: ActivityListGroup[]
}

export const useActivityGroups = ({ applet, events }: Props): Return => {
  const groupsInProgress = useAppSelector(appletModel.selectors.groupProgressSelector)

  const groupsResult = ActivityGroupsBuildManager.process({
    activities: applet.activities,
    flows: applet.activityFlows,
    events,
    entityProgress: groupsInProgress,
  })

  return {
    groups: groupsResult.groups,
  }
}
