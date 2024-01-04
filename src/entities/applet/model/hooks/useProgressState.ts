import { useCallback, useMemo } from "react"

import { conditionalLogicBuilder } from "../ConditionalLogicBuilder"
import { selectActivityProgress } from "../selectors"
import { actions } from "../slice"

import { getProgressId } from "~/abstract/lib"
import { useAppDispatch, useAppSelector } from "~/shared/utils"

type Props = {
  activityId: string
  eventId: string
}

export const useProgressState = (props: Props) => {
  const dispatch = useAppDispatch()

  const activityEventId = getProgressId(props.activityId, props.eventId)

  const activityProgress = useAppSelector(state => selectActivityProgress(state, activityEventId))

  const rawItems = useMemo(() => activityProgress?.items ?? [], [activityProgress])

  const items = conditionalLogicBuilder.process(rawItems)

  const step = activityProgress?.step ?? 0

  const item = items[step]

  const itemHasAnswer = item?.answer.length > 0

  const hasNextStep = step < items.length - 1

  const hasPrevStep = step > 0

  const canMoveNext = hasNextStep && itemHasAnswer

  const progress = useMemo(() => {
    const defaultProgressPercentage = 0

    if (!rawItems) {
      return defaultProgressPercentage
    }

    return ((step + 1) / rawItems.length) * 100
  }, [rawItems, step])

  const toNextStep = useCallback(() => {
    if (!canMoveNext) {
      return
    }

    dispatch(actions.incrementStep({ activityId: props.activityId, eventId: props.eventId }))
  }, [canMoveNext, dispatch, props.activityId, props.eventId])

  const toPrevStep = useCallback(() => {
    dispatch(actions.decrementStep({ activityId: props.activityId, eventId: props.eventId }))
  }, [dispatch, props.activityId, props.eventId])

  return {
    activityProgress,
    rawItems,

    items,
    item,

    toNextStep,
    toPrevStep,
    hasNextStep,
    hasPrevStep,
    step,

    progress,
    userEvents: activityProgress?.userEvents ?? [],
  }
}
