import { activityModel } from "~/entities/activity"

export const getFirstResponseDataIdentifierTextItem = (
  activityEventProgress: activityModel.types.ActivityEventProgressRecord[],
): string | null => {
  const firstResponseDataIdentifier = activityEventProgress.find(item => {
    if (item.responseType === "text") {
      return item.config.responseDataIdentifier
    }
    return false
  })

  if (!firstResponseDataIdentifier) {
    return null
  }

  return firstResponseDataIdentifier.answer[0]
}
