import { useMemo } from "react"

import { useTextVariablesReplacer } from "../lib/hooks"
import {
  useActivityEventProgressState,
  useSaveActivityItemAnswer,
  useSetAnswerUserEvent,
  useStepperState,
  useUserEvent,
} from "../model/hooks"
import { ActivityCardItemList } from "./ActivityCardItemList"

type ActivityItemStepperProps = {
  eventId: string
  activityId: string
  invalidItemIds: Array<string>
  onSubmitButtonClick: () => void
  openInvalidAnswerModal: () => void
  isAllItemsSkippable: boolean
  watermark?: string
  respondentNickname: string
  responseIsEditable: boolean
}

export const ActivityItemStepper = ({
  eventId,
  activityId,
  invalidItemIds,
  onSubmitButtonClick,
  openInvalidAnswerModal,
  isAllItemsSkippable,
  watermark,
  respondentNickname,
  responseIsEditable,
}: ActivityItemStepperProps) => {
  const { currentActivityEventProgress, nonHiddenActivities } = useActivityEventProgressState({
    eventId,
    activityId,
  })

  const answers = currentActivityEventProgress.map(activityEvent => activityEvent.answer)

  const { replaceTextVariables } = useTextVariablesReplacer({
    items: currentActivityEventProgress,
    answers: answers,
    activityId,
    respondentNickname,
  })

  const { saveUserEventByType } = useUserEvent({ activityId, eventId })
  const { saveSetAnswerUserEvent } = useSetAnswerUserEvent({ activityId, eventId })
  const { saveActivityItemAnswer } = useSaveActivityItemAnswer({ eventId, activityId })

  const { step, setStep } = useStepperState({ activityId, eventId })

  const itemsProgress = useMemo(() => {
    return nonHiddenActivities.slice(0, step).reverse()
  }, [nonHiddenActivities, step])

  const toNextStep = () => {
    setStep(step + 1)
  }

  const toPrevStep = () => {
    setStep(step - 1)
  }

  const isSubmitShown = step === nonHiddenActivities.length
  const isBackShown = itemsProgress.length > 1 && responseIsEditable

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
      saveUserEventByType={saveUserEventByType}
      onSubmitButtonClick={onSubmitButtonClick}
      openInvalidAnswerModal={openInvalidAnswerModal}
      invalidItemIds={invalidItemIds}
      replaceText={replaceTextVariables}
      isAllItemsSkippable={isAllItemsSkippable}
      watermark={watermark}
    />
  )
}
