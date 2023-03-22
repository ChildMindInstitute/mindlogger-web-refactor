import { useMemo } from "react"

import { useSelector } from "react-redux"

import { getActivityEventProgressId } from "../../lib"
import { activityEventProgressSelector } from "../selectors"

type UseActivityEventProgressStateProps = {
  activityId: string
  eventId: string
}

export const useActivityEventProgressState = (props: UseActivityEventProgressStateProps) => {
  const activityEventProgressState = useSelector(activityEventProgressSelector)

  const currentActivityEventStateProgress = useMemo(() => {
    const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)
    return activityEventProgressState[activityEventId]
  }, [activityEventProgressState, props.activityId, props.eventId])

  const currentActivityEventProgress = useMemo(() => {
    const activityEventProgress = currentActivityEventStateProgress

    if (!activityEventProgress) {
      return []
    }

    return activityEventProgress.activityEvents
  }, [currentActivityEventStateProgress])

  const lastActivityEventWithAnswerIndex = useMemo(() => {
    const activityEventProgress = currentActivityEventStateProgress
    const step = activityEventProgress.step

    // -1 === not foind
    // 0 === start index
    // If not found return start index
    if (step > 1) {
      return step - 1
    }

    return step
  }, [currentActivityEventStateProgress])

  const progress = useMemo(() => {
    const activityEventRecords = currentActivityEventStateProgress
    let answerCount = 0

    for (let i = 0; i < activityEventRecords.activityEvents.length; i++) {
      const isAnswerExist = activityEventRecords.activityEvents[i].answer.length
      if (isAnswerExist) {
        answerCount++
      }
    }

    return (answerCount / activityEventRecords.activityEvents.length) * 100
  }, [currentActivityEventStateProgress])

  return { currentActivityEventProgress, lastActivityEventWithAnswerIndex, progress }
}
