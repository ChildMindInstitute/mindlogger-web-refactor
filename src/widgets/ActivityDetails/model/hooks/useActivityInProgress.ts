import { ActivityDetails } from "~/entities/activity"
import { ActivityItem } from "~/entities/item"

type UseActivityInProgressReturn = {
  items: ActivityItem[]
  itemsProgressLength: number
}

export const useActivityInProgress = (
  appletId: string,
  eventId: string,
  activityDetails: ActivityDetails,
): UseActivityInProgressReturn => {
  const isOnePageAssessment = activityDetails.showAllAtOnce
  const itemsProgressLength = 0

  const calculateActivityProgress = (): ActivityItem[] => {
    let items: ActivityItem[] = []

    if (isOnePageAssessment) {
      items = [...activityDetails.items]
    } else {
      items = activityDetails.items.reduce<ActivityItem[]>((acc, item, index) => {
        if (index <= itemsProgressLength) {
          acc.push(item)
        }

        return acc
      }, [])
    }

    return items
  }

  const items = calculateActivityProgress()

  return {
    items,
    itemsProgressLength,
  }
}
