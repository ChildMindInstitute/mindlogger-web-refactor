import { useCallback } from "react"

import { activityModel } from "~/entities/activity"

type UseStepperStateManagerProps = {
  activityId: string
  eventId: string
}

type UseStepperStateManagerOutput = {
  step: number

  hasNextStep: boolean
  hasPrevStep: boolean

  toNextStep: () => void
  toPrevStep: () => void

  items: activityModel.types.ActivityEventProgressRecord[]
  currentItem: activityModel.types.ActivityEventProgressRecord | null
  userEvents: activityModel.types.UserEvents[]
}

export const useStepperStateManager = (props: UseStepperStateManagerProps): UseStepperStateManagerOutput => {
  const { currentActivityEventProgress, userEvents } = activityModel.hooks.useActivityEventProgressState({
    eventId: props.eventId,
    activityId: props.activityId,
  })

  const { step, setStep, currentItem } = activityModel.hooks.useStepperState({
    activityId: props.activityId,
    eventId: props.eventId,
  })

  const hasNextStep = step < currentActivityEventProgress.length

  const hasPrevStep = step > 1

  const toNextStep = useCallback(() => {
    if (hasNextStep) {
      setStep(step + 1)
    }
  }, [hasNextStep, setStep, step])

  const toPrevStep = useCallback(() => {
    if (hasPrevStep) {
      setStep(step - 1)
    }
  }, [hasPrevStep, setStep, step])

  return {
    step,
    currentItem,
    toNextStep,
    toPrevStep,
    hasNextStep,
    hasPrevStep,
    items: currentActivityEventProgress,
    userEvents,
  }
}
