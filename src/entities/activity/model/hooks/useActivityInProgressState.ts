import { ActivityProgressState } from "../activity.slice"
import { activitiesInProgressSelector } from "../selectors"

import { useAppSelector } from "~/shared/utils"

type UseActivityInProgressStateReturn = {
  activitiesInProgress: Record<string, ActivityProgressState>
}

export const useActivityInProgressState = (): UseActivityInProgressStateReturn => {
  const activitiesInProgress = useAppSelector(activitiesInProgressSelector)

  return {
    activitiesInProgress,
  }
}
