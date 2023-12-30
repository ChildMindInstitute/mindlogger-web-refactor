import { useCallback } from "react"

import { activityModel } from "~/entities/activity"
import { useAppDispatch } from "~/shared/utils"

type Props = {
  activityId: string
  eventId: string
}

type Return = {
  step: number

  hasNextStep: boolean
  hasPrevStep: boolean

  toNextStep: () => void
  toPrevStep: () => void

  items: activityModel.types.ActivityEventProgressRecord[]
  currentItem: activityModel.types.ActivityEventProgressRecord | null
  userEvents: activityModel.types.UserEvents[]
}

export const useStepperStateManager = (props: Props): Return => {
  const dispatch = useAppDispatch()

  const { items, userEvents, lastStep } = activityModel.hooks.useActivityEventProgressState({
    eventId: props.eventId,
    activityId: props.activityId,
  })

  const currentItem = items[lastStep - 1] ?? null

  const hasNextStep = lastStep < items.length

  const hasPrevStep = lastStep > 1

  const toNextStep = useCallback(() => {
    if (!hasNextStep) return

    dispatch(activityModel.actions.incrementStep({ activityId: props.activityId, eventId: props.eventId }))
  }, [dispatch, hasNextStep, props.activityId, props.eventId])

  const toPrevStep = useCallback(() => {
    if (!hasPrevStep) return

    dispatch(activityModel.actions.decrementStep({ activityId: props.activityId, eventId: props.eventId }))
  }, [dispatch, hasPrevStep, props.activityId, props.eventId])

  return {
    step: lastStep,
    currentItem,
    toNextStep,
    toPrevStep,
    hasNextStep,
    hasPrevStep,
    items,
    userEvents,
  }
}
