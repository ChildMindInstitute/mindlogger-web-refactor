import { useMemo } from "react"

import { conditionalLogicBuilder } from "../ConditionalLogicBuilder"
import { selectActivityProgress } from "../selectors"

import { getProgressId } from "~/abstract/lib"
import { useAppSelector } from "~/shared/utils"

type Props = {
  activityId: string
  eventId: string
}

export const useProgressState = (props: Props) => {
  const activityEventId = getProgressId(props.activityId, props.eventId)

  const activityProgress = useAppSelector(state => selectActivityProgress(state, activityEventId))

  const rawItems = useMemo(() => activityProgress?.items ?? [], [activityProgress])

  const items = conditionalLogicBuilder.process(rawItems)

  const lastStep = activityProgress?.step ?? 1

  const progress = useMemo(() => {
    const defaultProgressPercentage = 0

    if (!rawItems) {
      return defaultProgressPercentage
    }

    // Step always start from 1, but we want to paint progress when we pass some item
    return ((lastStep - 1) / items.length) * 100
  }, [rawItems, lastStep, items.length])

  return {
    activityProgress,
    rawItems,
    items,
    lastStep,
    progress,
    userEvents: activityProgress?.userEvents ?? [],
  }
}
