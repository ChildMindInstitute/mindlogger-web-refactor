import { useMemo } from "react"

import { useSelector } from "react-redux"

import { conditionalLogicBuilder, getActivityEventProgressId } from "../../lib"
import { activityEventProgressSelector } from "../selectors"

type UseActivityEventProgressStateProps = {
  activityId: string
  eventId: string
}

export const useActivityEventProgressState = (props: UseActivityEventProgressStateProps) => {
  const activityEventProgressState = useSelector(activityEventProgressSelector)

  const currentActivityEventProgressState = useMemo(() => {
    const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)
    return activityEventProgressState[activityEventId]
  }, [activityEventProgressState, props.activityId, props.eventId])

  const activitiesInProgress = useMemo(() => {
    if (!currentActivityEventProgressState?.activityEvents) {
      return []
    }

    return currentActivityEventProgressState.activityEvents
  }, [currentActivityEventProgressState])

  const availableActivitiesInProgress = useMemo(() => {
    return activitiesInProgress.filter(x => !x.isHidden)
  }, [activitiesInProgress])

  const activitiesInProgressWithConditionalLogic = useMemo(() => {
    return conditionalLogicBuilder.process(availableActivitiesInProgress)
  }, [availableActivitiesInProgress])

  const lastActivityEventWithAnswerIndex = useMemo(() => {
    const step = currentActivityEventProgressState?.step ?? 1

    // -1 === not foind
    // 0 === start index
    // If not found return start index
    if (step > 1) {
      return step - 1
    }

    return step
  }, [currentActivityEventProgressState])

  const progress = useMemo(() => {
    const defaultProgressPercentage = 0

    if (!currentActivityEventProgressState?.activityEvents) {
      return defaultProgressPercentage
    }

    const activitiesLength = activitiesInProgressWithConditionalLogic.length
    const lastStep = currentActivityEventProgressState?.step

    // Step always start from 1, but we want to paint progress when we pass some item
    return ((lastStep - 1) / activitiesLength) * 100
  }, [activitiesInProgressWithConditionalLogic.length, currentActivityEventProgressState])

  return {
    progress,
    lastActivityEventWithAnswerIndex,
    activityEvents: currentActivityEventProgressState?.activityEvents ?? [],
    userEvents: currentActivityEventProgressState?.userEvents ?? [],
    currentActivityEventProgress: activitiesInProgressWithConditionalLogic,
    nonHiddenActivities: availableActivitiesInProgress ?? [],
  }
}
