import { useCallback, useMemo } from "react"

import { activityModel, getActivityEventProgressId } from "~/entities/activity"
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

  const setStep = useCallback(
    (step: number): void => {
      const activityEventId = getActivityEventProgressId(props.activityId, props.eventId)
      dispatch(activityModel.actions.setActivityEventProgressStepByParams({ activityEventId, step }))
    },
    [dispatch, props.activityId, props.eventId],
  )

  const currentItem = items[lastStep - 1] ?? null

  const hasNextStep = lastStep < items.length

  const hasPrevStep = lastStep > 1

  const toNextStep = useCallback(() => {
    if (hasNextStep) setStep(lastStep + 1)
  }, [hasNextStep, setStep, lastStep])

  const toPrevStep = useCallback(() => {
    if (hasPrevStep) setStep(lastStep - 1)
  }, [hasPrevStep, setStep, lastStep])

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
