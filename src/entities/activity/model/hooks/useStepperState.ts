import { useCallback, useMemo } from "react"

import { getActivityEventProgressId } from "../../lib"
import { actions } from "../activity.slice"
import { ActivityEventProgressRecord } from "../types"
import { useActivityEventProgressState } from "./useActivityEventProgressState"

import { useAppDispatch } from "~/shared/utils"

type UseStepperStateProps = {
  activityId: string
  eventId: string
}

export const useStepperState = ({ activityId, eventId }: UseStepperStateProps) => {
  const dispatch = useAppDispatch()

  const { currentActivityEventStateProgress, items } = useActivityEventProgressState({
    activityId,
    eventId,
  })

  const step = useMemo(() => {
    if (!currentActivityEventStateProgress) {
      return 1
    }

    return currentActivityEventStateProgress.step
  }, [currentActivityEventStateProgress])

  const setStep = useCallback(
    (step: number): void => {
      const activityEventId = getActivityEventProgressId(activityId, eventId)
      dispatch(actions.setActivityEventProgressStepByParams({ activityEventId, step }))
    },
    [activityId, dispatch, eventId],
  )

  const currentItem = useMemo((): ActivityEventProgressRecord | null => {
    if (!items) {
      return null
    }

    const currentItem = items[step - 1]

    return currentItem
  }, [items, step])

  return { step, setStep, currentItem }
}
