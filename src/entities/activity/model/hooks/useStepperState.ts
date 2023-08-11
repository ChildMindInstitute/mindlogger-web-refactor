import { useCallback, useMemo } from "react"

import { useSelector } from "react-redux"

import { getActivityEventProgressId } from "../../lib"
import { actions } from "../activity.slice"
import { activityEventProgressSelector } from "../selectors"

import { useAppDispatch } from "~/shared/utils"

type UseStepperStateProps = {
  activityId: string
  eventId: string
}

export const useStepperState = ({ activityId, eventId }: UseStepperStateProps) => {
  const dispatch = useAppDispatch()

  const activityEventProgressState = useSelector(activityEventProgressSelector)

  const step = useMemo(() => {
    const activityEventId = getActivityEventProgressId(activityId, eventId)
    const activityEventProgress = activityEventProgressState[activityEventId]

    if (!activityEventProgress) {
      return 1
    }

    return activityEventProgress.step
  }, [activityEventProgressState, activityId, eventId])

  const setStep = useCallback(
    (step: number) => {
      const activityEventId = getActivityEventProgressId(activityId, eventId)
      dispatch(actions.setActivityEventProgressStepByParams({ activityEventId, step }))
    },
    [activityId, dispatch, eventId],
  )

  const currentItem = useMemo(() => {
    const activityEventId = getActivityEventProgressId(activityId, eventId)
    const activityEventProgress = activityEventProgressState[activityEventId]

    if (!activityEventProgress) {
      return null
    }

    const currentItem = activityEventProgress.activityEvents[step - 1]

    return currentItem
  }, [activityEventProgressState, activityId, eventId, step])

  return { step, setStep, currentItem }
}
