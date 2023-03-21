import { ActivityDetails, ActivityItemStepper } from "~/entities/activity"

interface ActivityItemListProps {
  appletId: string
  eventId: string
  activityDetails: ActivityDetails
}

export const ActivityItemList = ({ activityDetails, eventId }: ActivityItemListProps) => {
  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  // const buttonsConfig: ItemCardButtonsConfig = {
  //   isOnePageAssessment,
  //   isBackShown: activityDetails.items.length > 0,
  //   isSubmitShown: isOnePageAssessment && activityDetails.items.length === itemsProgressLength,
  //   isSkippable: activityDetails.isSkippable,
  //   isNextDisable: true, // Default value === TRUE  (Condition if answer value empty or not exist)
  // }

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
