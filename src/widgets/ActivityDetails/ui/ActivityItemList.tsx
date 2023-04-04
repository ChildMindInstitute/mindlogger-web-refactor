import { ActivityItemStepper, ActivityOnePageAssessment } from "~/entities/activity"
import { ActivityDTO } from "~/shared/api"

interface ActivityItemListProps {
  appletId: string
  eventId: string
  activityDetails: ActivityDTO
}

export const ActivityItemList = ({ activityDetails, eventId }: ActivityItemListProps) => {
  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  return (
    <>
      {/* {isSummaryScreen && <ActivitySummary />} */}
      {!isSummaryScreen && isOnePageAssessment && (
        <ActivityOnePageAssessment
          eventId={eventId}
          activityId={activityDetails.id}
          splashScreen={activityDetails.splashScreen}
        />
      )}
      {!isSummaryScreen && !isOnePageAssessment && (
        <ActivityItemStepper
          eventId={eventId}
          activityId={activityDetails.id}
          splashScreen={activityDetails.splashScreen}
        />
      )}
    </>
  )
}
