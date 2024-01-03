import { ActivityDetails } from "./types"

import { supportableResponseTypes } from "~/abstract/lib/constants"

export function isSupportedActivity(activity: ActivityDetails | undefined) {
  if (!activity) {
    return false
  }

  return activity.items.every(item => supportableResponseTypes.includes(item.responseType))
}
