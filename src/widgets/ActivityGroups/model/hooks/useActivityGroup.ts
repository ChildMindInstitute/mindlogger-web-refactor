import { ActivityGroupType, ActivityGroupTypeNames, ActivityListGroup } from "../../lib"
import groupMocks from "./mock"

import { Activity, ActivityStatus, ActivityType } from "~/entities/activity"
import { AppletDetailsDto } from "~/shared/api/"
import { appletMock } from "~/shared/mocks"

type UseActivityGroupsReturn = {
  groups: ActivityListGroup[]
  appletDetails?: AppletDetailsDto
}

export const useActivityGroups = (appletDetails?: AppletDetailsDto): UseActivityGroupsReturn => {
  const returnMocks = true

  if (returnMocks) {
    return {
      groups: groupMocks,
      appletDetails: appletMock,
    }
  }

  if (!appletDetails) {
    return {
      groups: [],
    }
  }

  const groups: ActivityListGroup[] = [
    {
      type: ActivityGroupType.Available,
      name: ActivityGroupTypeNames[ActivityGroupType.Available],
      activities: [],
    },
  ]

  const activityItems = groups[0].activities

  const activityFlowDtos = appletDetails.activityFlows

  const activityDtos = appletDetails.activities

  for (const flowDto of activityFlowDtos) {
    if (!flowDto.items.length) {
      continue
    }

    const activityDto = activityDtos.find(x => x.id === flowDto.items[0].activityId)

    const item: Activity = {
      id: flowDto.id,
      description: activityDto?.description.en ?? "",
      name: activityDto?.name ?? "",
      image: flowDto.image,
      hasEventContext: false,
      isInActivityFlow: true,
      activityFlowName: flowDto.name,
      activityPositionInFlow: 1,
      numberOfActivitiesInFlow: flowDto.items.length,
      showActivityFlowBadge: true,
      isTimedActivityAllow: false,
      isTimeoutAccess: false,
      isTimeoutAllow: false,
      status: ActivityStatus.NotDefined,
      type: ActivityType.NotDefined,
      availableFrom: null,
      availableTo: null,
      scheduledAt: null,
      timeToComplete: null,
    }

    activityItems.push(item)
  }

  for (const activityDto of activityDtos) {
    const item: Activity = {
      id: activityDto.id,
      description: activityDto.description.en,
      name: activityDto.name,
      image: activityDto.image,
      hasEventContext: false,
      isInActivityFlow: false,
      activityFlowName: null,
      activityPositionInFlow: null,
      numberOfActivitiesInFlow: null,
      showActivityFlowBadge: false,
      isTimedActivityAllow: false,
      isTimeoutAccess: false,
      isTimeoutAllow: false,
      status: ActivityStatus.NotDefined,
      type: ActivityType.NotDefined,
      availableFrom: null,
      availableTo: null,
      scheduledAt: null,
      timeToComplete: null,
    }

    activityItems.push(item)
  }

  return {
    groups,
    appletDetails: appletDetails,
  }
}
