import { ActivityDetails, activityModel } from "~/entities/activity"
import { ActivityItem } from "~/entities/item"

type UseActivityInProgressReturn = {
  activityInProgress: activityModel.types.ProgressPayloadState | undefined
  items: ActivityItem[]
}

export const useActivityInProgress = (
  activityDetails: ActivityDetails,
  eventId: string,
): UseActivityInProgressReturn => {
  const { activitiesInProgress } = activityModel.hooks.useActivityInProgressState()

  const selectedActivityId = activityDetails.id

  const isOnePageAssessment = activityDetails.showAllAtOnce

  const activityInProgress = activitiesInProgress.find(activity => {
    return activity.activityId === selectedActivityId && activity.eventId === eventId
  })

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
