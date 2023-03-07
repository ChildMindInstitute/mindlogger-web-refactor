import { ActivityEvents } from "./useActivityDetails"

import { ActivityDetails, activityModel } from "~/entities/activity"
import { ActivityItem } from "~/entities/item"

type UseActivityInProgressReturn = {
  activityInProgress: activityModel.types.ProgressPayloadState | undefined
  items: ActivityItem[]
}

export const useActivityInProgress = (
  activityDetails: ActivityDetails,
  activityEvents: ActivityEvents[],
): UseActivityInProgressReturn => {
  const { activitiesInProgress } = activityModel.hooks.useActivityInProgressState()

  const selectedActivityId = activityDetails.id

  const isOnePageAssessment = activityDetails.showAllAtOnce

  const eventIdByActivityId = activityEvents.find(event => event.activityId === selectedActivityId)?.eventId

  const activityInProgress = activitiesInProgress.find(
    ({ activityId, eventId }) => activityId === selectedActivityId && eventId === eventIdByActivityId,
  )

  const calculateActivityProgress = (): ActivityItem[] => {
    let items: ActivityItem[] = []

    if (isOnePageAssessment) {
      items = activityDetails.items.map(item => item)
    } else {
      items = activityDetails.items.reduce((acc, item, index) => {
        if (index < activitiesInProgress.length) {
          acc.push(item)
        }

        return acc
      }, [] as ActivityItem[])
    }

    return items
  }

  const items = calculateActivityProgress()

  return {
    activityInProgress,
    items,
  }
}
