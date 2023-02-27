import { ActivityListItem } from "~/entities/activity"
import { ActivityCardItemList } from "~/entities/item"

interface ActivityItemListProps {
  activityDetails: ActivityListItem
}

export const ActivityItemList = ({ activityDetails }: ActivityItemListProps) => {
  const isOnePageAssessment = true // mock
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
