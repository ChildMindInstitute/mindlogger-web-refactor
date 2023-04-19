import { useTextVariablesReplacer } from "../lib/hooks"
import { useActivityEventProgressState, useSaveActivityItemAnswer } from "../model/hooks"
import { ActivityCardItemList } from "./ActivityCardItemList"

type ActivityOnePageAssessmentProps = {
  eventId: string
  activityId: string
  invalidItemIds: Array<string>
  onSubmitButtonClick: () => void
  openInvalidAnswerModal: () => void
  isAllItemsSkippable: boolean
}

export const ActivityOnePageAssessment = ({
  eventId,
  activityId,
  invalidItemIds,
  onSubmitButtonClick,
  openInvalidAnswerModal,
  isAllItemsSkippable,
}: ActivityOnePageAssessmentProps) => {
  const { currentActivityEventProgress } = useActivityEventProgressState({
    eventId,
    activityId,
  })

  const answers = currentActivityEventProgress.map(activityEvent => activityEvent.answer)

  const { replaceTextVariables } = useTextVariablesReplacer({
    items: currentActivityEventProgress,
    answers: answers,
  })

  const { saveActivityItemAnswer } = useSaveActivityItemAnswer({ eventId, activityId })

  const isSubmitShown = true // Always true when one page assessment
  const isBackShown = false // Always false when one page assessment

  return (
    <ActivityCardItemList
      items={currentActivityEventProgress}
      isOnePageAssessment={true}
      isBackShown={isBackShown}
      isSubmitShown={isSubmitShown}
      invalidItemIds={invalidItemIds}
      setValue={saveActivityItemAnswer}
      onSubmitButtonClick={onSubmitButtonClick}
      openInvalidAnswerModal={openInvalidAnswerModal}
      replaceText={replaceTextVariables}
      isAllItemsSkippable={isAllItemsSkippable}
    />
  )
}
