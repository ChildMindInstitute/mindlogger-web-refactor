import { ActivityDetails, activityModel } from "~/entities/activity"
import { ActivityItem } from "~/entities/item"

type UseActivityInProgressReturn = {
  eventProgressState: activityModel.types.EventProgressState | null
  items: ActivityItem[]
  itemsProgressLength: number
}

export const useActivityInProgress = (
  appletId: string,
  eventId: string,
  activityDetails: ActivityDetails,
): UseActivityInProgressReturn => {
  const selectedActivityId = activityDetails.id
  const isOnePageAssessment = activityDetails.showAllAtOnce
  let itemsProgressLength = 0

  const { eventProgressByParams } = activityModel.hooks.useActivityInProgressState()

  const eventProgressState = eventProgressByParams({ appletId, activityId: selectedActivityId, eventId: eventId })

  if (eventProgressState) {
    itemsProgressLength = eventProgressState.itemAnswers.length
  }

  const calculateActivityProgress = (): ActivityItem[] => {
    let items: ActivityItem[] = []

    if (isOnePageAssessment) {
      items = [...activityDetails.items]
    } else {
      items = activityDetails.items.reduce<ActivityItem[]>((acc, item, index) => {
        if (index < itemsProgressLength) {
          acc.push(item)
        }

        return acc
      }, [])
    }

    return items
  }

  const items = calculateActivityProgress()

  return {
    eventProgressState,
    items,
    itemsProgressLength,
  }
}
