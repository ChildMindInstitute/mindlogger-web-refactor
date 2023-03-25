import { ActivityCardItemList } from "../../item"
import { ActivityDetails } from "../lib"
import { useActivityEventProgressState, useSaveActivityItemAnswer } from "../model/hooks"

type ActivityOnePageAssessmentProps = {
  eventId: string
  activityDetails: ActivityDetails
}

export const ActivityOnePageAssessment = ({ eventId, activityDetails }: ActivityOnePageAssessmentProps) => {
  const { currentActivityEventProgress } = useActivityEventProgressState({
    eventId,
    activityId: activityDetails.id,
  })

  const { saveActivityItemAnswer } = useSaveActivityItemAnswer({ eventId, activityId: activityDetails.id })

  const isSubmitShown = true // Always true when one page assessment
  const isBackShown = false // Always false when one page assessment

  return (
    <ActivityCardItemList
      items={currentActivityEventProgress}
      isOnePageAssessment={true}
      isBackShown={isBackShown}
      isSubmitShown={isSubmitShown}
      setValue={saveActivityItemAnswer}
    />
  )
}
