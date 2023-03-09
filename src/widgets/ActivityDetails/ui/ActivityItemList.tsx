import { ActivityDetails } from "~/entities/activity"
import { OnePageAssesmentFlow, StepByStepAssessmentFlow } from "~/entities/item"

interface ActivityItemListProps {
  appletId: string
  eventId: string
  activityDetails: ActivityDetails
}

export const ActivityItemList = ({ activityDetails, eventId, appletId }: ActivityItemListProps) => {
  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  const isOnePageAssessmentFlow = !isSummaryScreen && isOnePageAssessment
  const isStepByStepAssessmentFlow = !isSummaryScreen && !isOnePageAssessment

  return (
    <>
      {/* {isSummaryScreen && <ActivitySummary />} */}
      {isOnePageAssessmentFlow && <OnePageAssesmentFlow activityDetails={activityDetails} eventId={eventId} />}
      {isStepByStepAssessmentFlow && (
        <StepByStepAssessmentFlow activityDetails={activityDetails} eventId={eventId} appletId={appletId} />
      )}
    </>
  )
}
