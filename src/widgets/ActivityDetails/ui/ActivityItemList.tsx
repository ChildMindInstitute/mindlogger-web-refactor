import { useActivityInProgress } from "../model/hooks/useActivityInProgress"

import { ActivityDetails } from "~/entities/activity"
import { ActivityCardItemList, ItemCardButtonsConfig } from "~/entities/item"

interface ActivityItemListProps {
  appletId: string
  eventId: string
  activityDetails: ActivityDetails
}

export const ActivityItemList = ({ appletId, activityDetails, eventId }: ActivityItemListProps) => {
  const { items, itemsProgressLength } = useActivityInProgress(appletId, eventId, activityDetails)

  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  const buttonsConfig: ItemCardButtonsConfig = {
    isOnePageAssessment,
    isBackShown: activityDetails.items.length > 0,
    isSubmitShown: isOnePageAssessment && activityDetails.items.length === itemsProgressLength,
    isSkippable: activityDetails.isSkippable,
    isNextDisable: true, // Default value === TRUE  (Condition if answer value empty or not exist)
  }

  return (
    <>
      {/* {isSummaryScreen && <ActivitySummary />} */}
      {!isSummaryScreen && isOnePageAssessment && (
        <ActivityCardItemList items={items} itemCardButtonsConfig={buttonsConfig} />
      )}
      {!isSummaryScreen && !isOnePageAssessment && (
        <ActivityCardItemList items={items} itemCardButtonsConfig={buttonsConfig} />
      )}
    </>
  )
}
