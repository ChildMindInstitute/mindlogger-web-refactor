import { useCallback } from "react"

import { actions } from "../slice"

import { getActivityEventProgressId } from "~/abstract/lib"
import { useAppDispatch } from "~/shared/utils"

type Return = {
  clearActivityInProgressState: () => void
  clearActivityItemsProgressById: (activityId: string, eventId: string) => void
}

export const useActivityClearState = (): Return => {
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
