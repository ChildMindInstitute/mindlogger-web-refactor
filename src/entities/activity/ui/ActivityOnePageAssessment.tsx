import { useTextVariablesReplacer } from "../lib/hooks"
import { useActivityEventProgressState, useSaveActivityItemAnswer, useUserEvent } from "../model/hooks"
import { useSetAnswerUserEvent } from "../model/hooks/useSetAnswerUserEvent"
import { ActivityCardItemList } from "./ActivityCardItemList"

type ActivityOnePageAssessmentProps = {
  eventId: string
  activityId: string
  invalidItemIds: Array<string>
  onSubmitButtonClick: () => void
  openInvalidAnswerModal: () => void
  isAllItemsSkippable: boolean
  watermark?: string
  respondentNickname: string
}

export const ActivityOnePageAssessment = ({
  eventId,
  activityId,
  invalidItemIds,
  onSubmitButtonClick,
  openInvalidAnswerModal,
  isAllItemsSkippable,
  watermark,
  respondentNickname,
}: ActivityOnePageAssessmentProps) => {
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

  const isSubmitShown = true // Always true when one page assessment
  const isBackShown = false // Always false when one page assessment

  return (
    <ActivityCardItemList
      items={nonHiddenActivities}
      isOnePageAssessment={true}
      isBackShown={isBackShown}
      isSubmitShown={isSubmitShown}
      invalidItemIds={invalidItemIds}
      setValue={saveActivityItemAnswer}
      saveSetAnswerUserEvent={saveSetAnswerUserEvent}
      saveUserEventByType={saveUserEventByType}
      onSubmitButtonClick={onSubmitButtonClick}
      openInvalidAnswerModal={openInvalidAnswerModal}
      replaceText={replaceTextVariables}
      isAllItemsSkippable={isAllItemsSkippable}
      watermark={watermark}
    />
  )
}
