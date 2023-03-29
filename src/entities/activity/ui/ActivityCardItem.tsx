import { ItemCardButtonsConfig } from "../lib"
import { ActivityEventProgressRecord } from "../model/types"
import { ItemCardButton } from "./ItemCardButtons"
import { ItemPicker } from "./items/ItemPicker"

import { CardItem } from "~/shared/ui"

type ActivityCardItemProps = {
  activityItem: ActivityEventProgressRecord
  isOnePageAssessment: boolean
  isBackShown: boolean
  isSubmitShown: boolean

  isActive: boolean
  toNextStep?: () => void
  toPrevStep?: () => void
  value?: string
  setValue: (itemId: string, answer: string) => void
}

export const ActivityCardItem = ({
  activityItem,
  isOnePageAssessment,
  isBackShown,
  isSubmitShown,
  toNextStep,
  toPrevStep,
  isActive,
  value = "",
  setValue,
}: ActivityCardItemProps) => {
  const buttonConfig: ItemCardButtonsConfig = {
    isNextDisable: !value || !value.length,
    isSkippable: activityItem.config.skippableItem,
    isOnePageAssessment,
    isBackShown: isBackShown && !activityItem.config.removeBackButton,
    isSubmitShown: isSubmitShown,
  }

  const onNextButtonClick = () => {
    if (toNextStep) {
      toNextStep()
    }
  }

  const onBackButtonClick = () => {
    if (toPrevStep) {
      toPrevStep()
    }
  }

  const onItemValueChange = (value: string) => {
    setValue(activityItem.id, value)
  }

  return (
    <CardItem
      markdown={activityItem.question}
      buttons={
        isActive ? (
          <ItemCardButton
            config={buttonConfig}
            onNextButtonClick={onNextButtonClick}
            onBackButtonClick={onBackButtonClick}
          />
        ) : (
          <></>
        )
      }>
      <ItemPicker item={activityItem} value={value} onValueChange={onItemValueChange} isDisabled={!isActive} />
    </CardItem>
  )
}
