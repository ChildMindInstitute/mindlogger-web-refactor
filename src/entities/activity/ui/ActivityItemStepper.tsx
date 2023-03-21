import { useMemo, useState } from "react"

import { ActivityCardItemList } from "../../item"
import { ActivityDetails } from "../lib"
import { useActivityEventProgressState } from "../model/hooks"

type ActivityItemStepperProps = {
  eventId: string
  activityDetails: ActivityDetails
}

export const ActivityItemStepper = ({ eventId, activityDetails }: ActivityItemStepperProps) => {
  const [step, setStep] = useState<number>(1)

  const { currentActivityEventProgress } = useActivityEventProgressState({
    eventId,
    activityId: activityDetails.id,
  })

  const toNextStep = () => {
    setStep(currentStep => currentStep + 1)
  }

  const toPrevStep = () => {
    setStep(currentStep => currentStep - 1)
  }

  const itemsProgress = useMemo(() => {
    return currentActivityEventProgress.slice(0, step).reverse()
  }, [currentActivityEventProgress, step])

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
