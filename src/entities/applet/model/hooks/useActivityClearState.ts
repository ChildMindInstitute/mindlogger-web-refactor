import { useCallback } from "react"

import { actions } from "../slice"

import { getActivityEventProgressId } from "~/entities/activity/lib"
import { useAppDispatch } from "~/shared/utils"

type UseActivityClearStateReturn = {
  clearActivityInProgressState: () => void
  clearActivityItemsProgressById: (activityId: string, eventId: string) => void
}

export const useActivityClearState = (): UseActivityClearStateReturn => {
  const dispatch = useAppDispatch()

  const clearActivityInProgressState = useCallback(() => {
    dispatch(actions.clearActivity())
  }, [dispatch])

  const clearActivityItemsProgressById = useCallback(
    (activityId: string, eventId: string) => {
      const activityEventId = getActivityEventProgressId(activityId, eventId)

      dispatch(actions.clearActivityItemsProgressById({ activityEventId }))
    },
    [dispatch],
  )

  return {
    clearActivityInProgressState,
    clearActivityItemsProgressById,
  }
}
