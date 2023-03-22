import { ActivityDetails, ActivityItemStepper } from "~/entities/activity"

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
      {/* {!isSummaryScreen && isOnePageAssessment && (
        <ActivityCardItemList items={items} itemCardButtonsConfig={buttonsConfig} />
      )} */}
      {!isSummaryScreen && !isOnePageAssessment && (
        <ActivityItemStepper eventId={eventId} activityDetails={activityDetails} />
      )}
    </>
  )
}
