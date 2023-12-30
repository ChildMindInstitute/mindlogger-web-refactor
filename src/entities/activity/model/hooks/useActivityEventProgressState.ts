import { useMemo } from "react"

import { conditionalLogicBuilder, getActivityEventProgressId } from "../../lib"
import { selectActivityProgress } from "../selectors"

import { useAppSelector } from "~/shared/utils"

type Props = {
  activityId: string
  eventId: string
}

export const useActivityEventProgressState = (props: Props) => {
  const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)

  const activityProgress = useAppSelector(state => selectActivityProgress(state, activityEventId))

  const rawItems = useMemo(() => activityProgress?.items ?? [], [activityProgress])

  const items = conditionalLogicBuilder.process(rawItems)

  const lastItemWithAnswerIndex = useMemo(() => {
    const step = activityProgress?.step ?? 1

    // -1 === not found
    // 0 === start index
    // If not found return start index
    if (step > 1) {
      return step - 1
    }

    return step
  }, [activityProgress])

  const progress = useMemo(() => {
    const defaultProgressPercentage = 0

    if (!rawItems) {
      return defaultProgressPercentage
    }

    const activityEventLength = items.length
    const lastStep = activityProgress?.step

    // Step always start from 1, but we want to paint progress when we pass some item
    return ((lastStep - 1) / activityEventLength) * 100
  }, [items.length, activityProgress?.step, rawItems])

  return {
    rawItems,
    items,
    currentActivityEventStateProgress: activityProgress,
    lastActivityEventWithAnswerIndex: lastItemWithAnswerIndex,
    progress,
    userEvents: activityProgress?.userEvents ?? [],
  }
}
