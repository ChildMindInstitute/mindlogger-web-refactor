import { ActivityListGroup } from "../../lib"
import { ActivityGroupsBuildManager } from "../services/ActivityGroupsBuildManager"

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
    applet,
    events,
    entityProgress: groupsInProgress,
  })

  return {
    groups: groupsResult.groups,
  }
}
