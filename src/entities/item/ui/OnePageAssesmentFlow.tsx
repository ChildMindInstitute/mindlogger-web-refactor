import { ActivityDetails } from "../../activity"
import { ItemCardButtonsConfig } from "../lib"
import { ActivityCardItemList } from "./ActivityCardItemList"

type OnePageAssesmentFlowProps = {
  activityDetails: ActivityDetails
  eventId: string
}

export const OnePageAssesmentFlow = ({ activityDetails }: OnePageAssesmentFlowProps) => {
  const buttonsConfig: ItemCardButtonsConfig = {
    isOnePageAssessment: true,
    isBackShown: false,
    isSubmitShown: true,
    isSkippable: activityDetails.isSkippable,
    isNextDisable: true, // Default value === TRUE  (Condition if answer value empty or not exist)
  }

  return <ActivityCardItemList items={activityDetails.items} itemCardButtonsConfig={buttonsConfig} />
}
