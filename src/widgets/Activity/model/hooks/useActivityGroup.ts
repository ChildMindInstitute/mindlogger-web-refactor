import { useAppletByIdQuery } from "../../api"
import { ActivityGroupType, ActivityGroupTypeNames, ActivityListGroup } from "../../lib"
import groupMocks from "./mock"

import { ActivityListItem, ActivityStatus, ActivityType } from "~/entities/activity"
import { AppletDetailsDto } from "~/shared/api/"

type UseActivityGroupsReturn = {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error?: ReturnType<typeof useAppletByIdQuery>["error"]
  groups: ActivityListGroup[]
}

export const useActivityGroups = (appletId: string): UseActivityGroupsReturn => {
  const returnMocks = true

  const { data: detailsResponse, isLoading, isSuccess, error, isError } = useAppletByIdQuery(appletId)

  if (returnMocks) {
    return {
      groups: groupMocks,
      isSuccess,
      isLoading: false,
      error,
      isError: false,
    }
  }

  const appletDetails: AppletDetailsDto | undefined = detailsResponse?.data?.result

  if (!appletDetails) {
    return {
      groups: [],
      isSuccess,
      isLoading,
      error,
      isError,
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

    const item: ActivityListItem = {
      id: flowDto.id,
      description: activityDto!.description.en,
      name: activityDto!.name,
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
    const item: ActivityListItem = {
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
    isLoading,
    isSuccess,
    isError,
    error,
    groups,
  }
}
