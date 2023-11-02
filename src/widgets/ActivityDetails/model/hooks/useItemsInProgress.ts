import { activityModel } from "~/entities/activity"

type UseActivityInProgressReturn = {
  currentActivityEventProgress: activityModel.types.ActivityEventProgressRecord[]
}

export const useItemsInProgress = (eventId: string, activityId: string): UseActivityInProgressReturn => {
  const { currentActivityEventProgress } = activityModel.hooks.useActivityEventProgressState({
    eventId,
    activityId,
  })

  return {
    currentActivityEventProgress,
  }
}
