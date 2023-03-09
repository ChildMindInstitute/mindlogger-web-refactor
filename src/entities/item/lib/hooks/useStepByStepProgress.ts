import { ActivityDetails, activityModel } from "~/entities/activity"
import { ActivityItem } from "~/entities/item"

type UseActivityInProgressReturn = {
  items: ActivityItem[]
  activityProgressLength: number
}

export const useStepByStepProgress = (
  activityDetails: ActivityDetails,
  eventId: string,
  appletId: string,
): UseActivityInProgressReturn => {
  const { eventProgressByParams } = activityModel.hooks.useActivityInProgressState()

  const eventProgressState = eventProgressByParams({ appletId, activityId: activityDetails.id, eventId })

  let progressLength = 0

  if (eventProgressState) {
    progressLength = eventProgressState.itemAnswers.length
  }

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
    items,
    activityProgressLength: progressLength,
  }
}
