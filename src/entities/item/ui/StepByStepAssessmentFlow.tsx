import { ActivityDetails } from "../../activity"
import { ItemCardButtonsConfig, useStepByStepProgress } from "../lib"
import { ActivityCardItemList } from "./ActivityCardItemList"

type StepByStepAssessmentFlowProps = {
  activityDetails: ActivityDetails
  eventId: string
}

export const StepByStepAssessmentFlow = ({ activityDetails, eventId }: StepByStepAssessmentFlowProps) => {
  const { items, activityProgressLength } = useStepByStepProgress(activityDetails, eventId)

  const buttonsConfig: ItemCardButtonsConfig = {
    isOnePageAssessment: false,
    isBackShown: activityProgressLength > 1,
    isSubmitShown: activityDetails.items.length === activityProgressLength,
    isSkippable: activityDetails.isSkippable,
    isNextDisable: true, // Default value === TRUE  (Condition if answer value empty or not exist)
  }

  return <ActivityCardItemList items={items} itemCardButtonsConfig={buttonsConfig} />
}
