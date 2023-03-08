import { useActivityInProgress } from "../model/hooks/useActivityInProgress"

import { ActivityDetails } from "~/entities/activity"
import { ActivityCardItemList, ItemCardButtonsConfig } from "~/entities/item"

interface ActivityItemListProps {
  activityDetails: ActivityDetails
  eventId: string
}

export const ActivityItemList = ({ activityDetails, eventId }: ActivityItemListProps) => {
  const { activityInProgress, items } = useActivityInProgress(activityDetails, eventId)

  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  const buttonsConfig: ItemCardButtonsConfig = {
    isOnePageAssessment,
    isBackShown: activityDetails.items.length > 1,
    isSubmitShown: isOnePageAssessment && activityDetails.items.length === activityInProgress?.answers.length,
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
