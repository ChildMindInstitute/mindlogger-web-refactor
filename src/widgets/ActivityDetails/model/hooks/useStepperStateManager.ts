import { useCallback } from "react"

import { appletModel } from "~/entities/applet"
import { useAppDispatch } from "~/shared/utils"

type Props = {
  items: appletModel.ItemRecord[]
  step: number
  activityId: string
  eventId: string
}

type Return = {
  hasNextStep: boolean
  hasPrevStep: boolean

  toNextStep: () => void
  toPrevStep: () => void

  currentItem: appletModel.ItemRecord | null
}

export const useStepperStateManager = (props: Props): Return => {
  const dispatch = useAppDispatch()

  const currentItem = props.items[props.step - 1] ?? null

  const hasNextStep = props.step < props.items.length

  const hasPrevStep = props.step > 1

  const toNextStep = useCallback(() => {
    if (!hasNextStep) return

    dispatch(appletModel.actions.incrementStep({ activityId: props.activityId, eventId: props.eventId }))
  }, [dispatch, hasNextStep, props.activityId, props.eventId])

  const toPrevStep = useCallback(() => {
    if (!hasPrevStep) return

    dispatch(appletModel.actions.decrementStep({ activityId: props.activityId, eventId: props.eventId }))
  }, [dispatch, hasPrevStep, props.activityId, props.eventId])

  return {
    currentItem,
    toNextStep,
    toPrevStep,
    hasNextStep,
    hasPrevStep,
  }
}
