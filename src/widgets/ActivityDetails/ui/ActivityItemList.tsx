import { ActivityDetails, ActivityItemStepper, ActivityOnePageAssessment } from "~/entities/activity"

interface ActivityItemListProps {
  appletId: string
  eventId: string
  activityDetails: ActivityDetails
}

export const ActivityItemList = ({ activityDetails, eventId }: ActivityItemListProps) => {
  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  return (
    <>
      {/* {isSummaryScreen && <ActivitySummary />} */}
      {!isSummaryScreen && isOnePageAssessment && (
        <ActivityOnePageAssessment eventId={eventId} activityDetails={activityDetails} />
      )}
      {!isSummaryScreen && !isOnePageAssessment && (
        <ActivityItemStepper eventId={eventId} activityDetails={activityDetails} />
      )}
    </>
  )
}
