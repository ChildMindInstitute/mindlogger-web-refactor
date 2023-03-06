import { ActivityDetails } from "~/entities/activity"
import { ActivityCardItemList, mockItemList } from "~/entities/item"

interface ActivityItemListProps {
  activityDetails: ActivityDetails
}

export const ActivityItemList = ({ activityDetails }: ActivityItemListProps) => {
  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  const isBackShown = activityDetails.items.length > 1
  const isNextShown = true // Always
  const isNextDisable = true // Condition if answer value empty or not exist

  const isSubmitShown = false // TRUE when items.length === inProgress.items.length
  const isSkippable = false // item.skippable || activityDetails.skippable

  return (
    <>
      {/* Should be implemented after ITEMs */}
      {/* {isSummaryScreen && <ActivitySummary />} */}
      {!isSummaryScreen && isOnePageAssessment && <ActivityCardItemList items={activityDetails.items} />}
      {!isSummaryScreen && !isOnePageAssessment && <ActivityCardItemList items={mockItemList} />}
    </>
  )
}
