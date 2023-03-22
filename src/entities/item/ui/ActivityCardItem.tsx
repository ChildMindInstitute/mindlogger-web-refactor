import { useState } from "react"

import { ActivityEventProgressRecord } from "../../activity/model/types"
import { ItemCardButtonsConfig } from "../lib/item.schema"
import { ItemCardButton } from "./ItemCardButtons"

import { TextItem, CardItem } from "~/shared/ui"

type ActivityCardItemProps = {
  activityItem: ActivityEventProgressRecord
  isOnePageAssessment: boolean
  isBackShown: boolean
  isSubmitShown: boolean

  isActive: boolean
  toNextStep: () => void
  toPrevStep: () => void
}

export const ActivityCardItem = ({
  activityItem,
  isOnePageAssessment,
  isBackShown,
  isSubmitShown,
  toNextStep,
  toPrevStep,
  isActive,
}: ActivityCardItemProps) => {
  const [value, setValue] = useState<string | undefined>(undefined)

  const buttonConfig: ItemCardButtonsConfig = {
    isNextDisable: !value || !value.length,
    isSkippable: activityItem.config.isSkippable,
    isOnePageAssessment,
    isBackShown: isBackShown && activityItem.config.isAbleToMoveToPrevious,
    isSubmitShown: isSubmitShown,
  }

  const onNextButtonClick = () => {
    toNextStep()
  }

  const onBackButtonClick = () => {
    toPrevStep()
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
      <TextItem value={value} setValue={setValue} disabled={!isActive} />
    </CardItem>
  )
}
