import { useMemo } from "react"

import { useTextVariablesReplacer } from "../lib/hooks"
import { useActivityEventProgressState, useSaveActivityItemAnswer, useStepperState } from "../model/hooks"
import { useSetAnswerUserEvent } from "../model/hooks/useSaveUserEvent"
import { ActivityCardItemList } from "./ActivityCardItemList"

type ActivityItemStepperProps = {
  eventId: string
  activityId: string
  invalidItemIds: Array<string>
  onSubmitButtonClick: () => void
  openInvalidAnswerModal: () => void
  isAllItemsSkippable: boolean
  watermark?: string
}

export const ActivityItemStepper = ({
  eventId,
  activityId,
  invalidItemIds,
  onSubmitButtonClick,
  openInvalidAnswerModal,
  isAllItemsSkippable,
  watermark,
}: ActivityItemStepperProps) => {
  const { currentActivityEventProgress } = useActivityEventProgressState({
    eventId,
    activityId,
  })

  const answers = currentActivityEventProgress.map(activityEvent => activityEvent.answer)

  const { replaceTextVariables } = useTextVariablesReplacer({
    items: currentActivityEventProgress,
    answers: answers,
  })

  const { saveSetAnswerUserEvent } = useSetAnswerUserEvent({ activityId, eventId })
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
      saveSetAnswerUserEvent={saveSetAnswerUserEvent}
      onSubmitButtonClick={onSubmitButtonClick}
      openInvalidAnswerModal={openInvalidAnswerModal}
      invalidItemIds={invalidItemIds}
      replaceText={replaceTextVariables}
      isAllItemsSkippable={isAllItemsSkippable}
      watermark={watermark}
    />
  )
}
