import { ActivityDetails } from "~/entities/activity"
import { ActivityCardItemList } from "~/entities/item"

interface ActivityItemListProps {
  activityDetails: ActivityDetails
}

export const ActivityItemList = ({ activityDetails }: ActivityItemListProps) => {
  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock
  return (
    <>
      {/* Should be implemented after ITEMs */}
      {/* {isSummaryScreen && <ActivitySummary />} */}
      {!isSummaryScreen && isOnePageAssessment && <ActivityCardItemList />}
      {/* {!isSummaryScreen && !isOnePageAssessment && _.map(items.slice(0, availableItems).reverse())} */}
    </>
  )
}
