import { ActivityDetails } from "../../activity"
import { ItemCardButtonsConfig, useActivityInProgress } from "../lib"
import { ActivityCardItemList } from "./ActivityCardItemList"

type StepByStepAssessmentFlowProps = {
  activityDetails: ActivityDetails
  eventId: string
}

export const StepByStepAssessmentFlow = ({ activityDetails, eventId }: StepByStepAssessmentFlowProps) => {
  const { activityInProgress, items } = useActivityInProgress(activityDetails, eventId)

  const buttonsConfig: ItemCardButtonsConfig = {
    isOnePageAssessment: false,
    isBackShown: activityDetails.items.length > 1,
    isSubmitShown: activityDetails.items.length === activityInProgress?.answers.length,
    isSkippable: activityDetails.isSkippable,
    isNextDisable: true, // Default value === TRUE  (Condition if answer value empty or not exist)
  }

  return <ActivityCardItemList items={items} itemCardButtonsConfig={buttonsConfig} />
}
