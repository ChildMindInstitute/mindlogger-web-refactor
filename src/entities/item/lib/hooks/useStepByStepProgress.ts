import { ActivityDetails, activityModel } from "~/entities/activity"
import { ActivityItem } from "~/entities/item"

type UseActivityInProgressReturn = {
  activityProgress: activityModel.types.ProgressPayloadState
  items: ActivityItem[]
  activityProgressLength: number
}

export const useStepByStepProgress = (
  activityDetails: ActivityDetails,
  eventId: string,
): UseActivityInProgressReturn => {
  const { activitiesInProgress } = activityModel.hooks.useActivityInProgressState()

  const activityProgress = activitiesInProgress.find(progressEl => {
    return progressEl.activityId === activityDetails.id && progressEl.eventId === eventId
  })

  if (!activityProgress) {
    throw new Error("Activity in progress not found")
  }

  const progressLength = activityProgress.answers.length

  const calculateActivityProgress = (): ActivityItem[] => {
    return activityDetails.items.reduce((acc, item, index) => {
      if (index <= progressLength) {
        acc.push(item)
      }

      return acc
    }, [] as ActivityItem[])
  }

  const items = calculateActivityProgress()

  return {
    activityProgress,
    items,
    activityProgressLength: progressLength,
  }
}
