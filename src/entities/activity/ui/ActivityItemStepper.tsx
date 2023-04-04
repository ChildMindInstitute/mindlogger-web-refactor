import { useMemo } from "react"

import { useActivityEventProgressState, useSaveActivityItemAnswer, useStepperState } from "../model/hooks"
import { ActivityCardItemList } from "./ActivityCardItemList"

type ActivityItemStepperProps = {
  eventId: string
  activityId: string
  splashScreen: string | null
}

export const ActivityItemStepper = ({ eventId, activityId, splashScreen }: ActivityItemStepperProps) => {
  const { currentActivityEventProgress } = useActivityEventProgressState({
    eventId,
    activityId,
  })

  const { saveActivityItemAnswer } = useSaveActivityItemAnswer({ eventId, activityId })

  const { step, setStep } = useStepperState({ activityId, eventId })

  const itemsProgress = useMemo(() => {
    return currentActivityEventProgress.slice(0, step).reverse()
  }, [currentActivityEventProgress, step])

  const toNextStep = () => {
    setStep(step + 1)
  }

  const toPrevStep = () => {
    setStep(step - 1)
  }

  const isSubmitShown = step === currentActivityEventProgress.length
  const isBackShown = itemsProgress.length > 1

  return (
    <ActivityCardItemList
      items={itemsProgress}
      isOnePageAssessment={false}
      isBackShown={isBackShown}
      isSubmitShown={isSubmitShown}
      toNextStep={toNextStep}
      toPrevStep={toPrevStep}
      setValue={saveActivityItemAnswer}
      splashScreen={splashScreen}
    />
  )
}
