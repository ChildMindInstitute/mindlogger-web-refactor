import { useMemo } from "react"

import { ActivityCardItemList } from "../../item"
import { ActivityDetails } from "../lib"
import { useActivityEventProgressState, useSaveActivityItemAnswer, useStepperState } from "../model/hooks"

type ActivityItemStepperProps = {
  eventId: string
  activityDetails: ActivityDetails
}

export const ActivityItemStepper = ({ eventId, activityDetails }: ActivityItemStepperProps) => {
  const { currentActivityEventProgress } = useActivityEventProgressState({
    eventId,
    activityId: activityDetails.id,
  })

  const { saveActivityItemAnswer } = useSaveActivityItemAnswer({ eventId, activityId: activityDetails.id })

  const { step, setStep } = useStepperState({ activityId: activityDetails.id, eventId })

  const itemsProgress = useMemo(() => {
    return currentActivityEventProgress.slice(0, step).reverse()
  }, [currentActivityEventProgress, step])

  const toNextStep = (itemId: string, answer: string) => {
    saveActivityItemAnswer(itemId, answer)
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
    />
  )
}
