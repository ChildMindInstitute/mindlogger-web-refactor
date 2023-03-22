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

  const currentActivityEventProgress = useMemo(() => {
    const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)
    const activityEventProgress = activityEventProgressState[activityEventId]

    if (!activityEventProgress) {
      return []
    }

    return activityEventProgress.activityEvents
  }, [activityEventProgressState, props.activityId, props.eventId])

  const lastActivityEventWithAnswerIndex = useMemo(() => {
    const index = currentActivityEventProgress.findIndex(item => item.answer.length === 0)

    // -1 === not foind
    // 0 === start index
    // If not found return start index
    if (index === -1) {
      return 0
    }

    return index
  }, [currentActivityEventProgress])

  return { currentActivityEventProgress, lastActivityEventWithAnswerIndex }
}
