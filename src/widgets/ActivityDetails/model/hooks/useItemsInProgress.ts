import { ActivityDetails, activityModel } from "~/entities/activity"

type UseActivityInProgressReturn = {
  currentActivityEventProgress: activityModel.types.ActivityEventProgressRecord[]
}

export const useItemsInProgress = (eventId: string, activityDetails: ActivityDetails): UseActivityInProgressReturn => {
  const { currentActivityEventProgress } = activityModel.hooks.useActivityEventProgressState({
    eventId,
    activityId: activityDetails.id,
  })

  return {
    currentActivityEventProgress,
  }
}
