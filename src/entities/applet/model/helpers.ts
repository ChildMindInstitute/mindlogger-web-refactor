import { supportableResponseTypes } from "~/abstract/lib/constants"
import { ActivityDetails } from "~/entities/activity"

export function isSupportedActivity(activity: ActivityDetails | undefined) {
  if (!activity) {
    return false
  }

  return activity.items.every(item => supportableResponseTypes.includes(item.responseType))
}
