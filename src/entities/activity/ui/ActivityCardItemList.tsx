import { PropsWithChildren } from "react"

import { ActivityEventProgressRecord } from "../model/types"
import { ActivityCardItem } from "./ActivityCardItem"

type ActivityCardItemListProps = PropsWithChildren<{
  items: ActivityEventProgressRecord[]
  isOnePageAssessment: boolean
  isBackShown: boolean
  isSubmitShown: boolean

  invalidItemIds: Array<string>
  onSubmitButtonClick: () => void
  openInvalidAnswerModal: () => void
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
  openInvalidAnswerModal,
  invalidItemIds,
}: ActivityCardItemListProps) => {
  return (
    <div>
      {items.map((item, index) => {
        const firstElement = 0
        const isActive = index === firstElement || isOnePageAssessment

        const isStepByStepSubmitButtonShownCondition = isSubmitShown && index === 0
        const isOnePageSubmitButtonShownCondition = isSubmitShown && index === items.length - 1

        const initialAnswer = item.answer

        const isInvalidItem = invalidItemIds.includes(item.id)
        return (
          <ActivityCardItem
            key={item.id}
            activityItem={item}
            isBackShown={isBackShown}
            isOnePageAssessment={isOnePageAssessment}
            isSubmitShown={
              isOnePageAssessment ? isOnePageSubmitButtonShownCondition : isStepByStepSubmitButtonShownCondition
            }
            toNextStep={toNextStep}
            toPrevStep={toPrevStep}
            isActive={isActive}
            isInvalid={isInvalidItem}
            values={initialAnswer}
            setValue={setValue}
            onSubmitButtonClick={onSubmitButtonClick}
            openInvalidAnswerModal={openInvalidAnswerModal}
          />
        )
      })}
    </div>
  )
}
