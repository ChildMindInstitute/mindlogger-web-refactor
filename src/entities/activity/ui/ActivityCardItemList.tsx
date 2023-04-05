import { PropsWithChildren } from "react"

import { ActivityEventProgressRecord } from "../model/types"
import { ActivityCardItem } from "./ActivityCardItem"

type ActivityCardItemListProps = PropsWithChildren<{
  items: ActivityEventProgressRecord[]
  isOnePageAssessment: boolean
  isBackShown: boolean
  isSubmitShown: boolean

  onSubmitButtonClick: () => void
  toNextStep?: () => void
  toPrevStep?: () => void
  setValue: (itemId: string, answer: string[]) => void
}>

export const ActivityCardItemList = ({
  items,
  isBackShown,
  isOnePageAssessment,
  isSubmitShown,
  toNextStep,
  toPrevStep,
  setValue,
  onSubmitButtonClick,
}: ActivityCardItemListProps) => {
  return (
    <div>
      {items.map((item, index) => {
        const firstElement = 0
        const isActive = index === firstElement || isOnePageAssessment

        const iSubmitButtonShown = isOnePageAssessment || (isSubmitShown && index === items.length - 1)

        const initialAnswer = item.answer
        return (
          <ActivityCardItem
            key={item.id}
            activityItem={item}
            isBackShown={isBackShown}
            isOnePageAssessment={isOnePageAssessment}
            isSubmitShown={iSubmitButtonShown}
            toNextStep={toNextStep}
            toPrevStep={toPrevStep}
            isActive={isActive}
            values={initialAnswer}
            setValue={setValue}
            onSubmitButtonClick={onSubmitButtonClick}
          />
        )
      })}
    </div>
  )
}
