import { ActivityDetails } from "~/entities/activity"
import { OnePageAssesmentFlow, StepByStepAssessmentFlow } from "~/entities/item"

interface ActivityItemListProps {
  activityDetails: ActivityDetails
  eventId: string
}

export const ActivityItemList = ({ activityDetails, eventId }: ActivityItemListProps) => {
  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  const isOnePageAssessmentFlow = !isSummaryScreen && isOnePageAssessment
  const isStepByStepAssessmentFlow = !isSummaryScreen && !isOnePageAssessment

  return (
    <>
      {/* {isSummaryScreen && <ActivitySummary />} */}
      {isOnePageAssessmentFlow && <OnePageAssesmentFlow activityDetails={activityDetails} eventId={eventId} />}
      {isStepByStepAssessmentFlow && <StepByStepAssessmentFlow activityDetails={activityDetails} eventId={eventId} />}
    </>
  )
}
