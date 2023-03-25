import { PropsWithChildren } from "react"

import { ActivityEventProgressRecord } from "../../activity/model/types"
import { ActivityCardItem } from "./ActivityCardItem"

type ActivityCardItemListProps = PropsWithChildren<{
  items: ActivityEventProgressRecord[]
  isOnePageAssessment: boolean
  isBackShown: boolean
  isSubmitShown: boolean

  toNextStep?: () => void
  toPrevStep?: () => void
  setValue: (itemId: string, answer: string) => void
}>

export const ActivityCardItemList = ({
  items,
  isBackShown,
  isOnePageAssessment,
  isSubmitShown,
  toNextStep,
  toPrevStep,
  setValue,
}: ActivityCardItemListProps) => {
  return (
    <>
      {items.map((item, index) => {
        const firstElement = 0
        const isActive = index === firstElement || isOnePageAssessment
        const iSubmitButtonShown = isOnePageAssessment && isSubmitShown && index === items.length - 1

        const initialAnswer = item.answer.length > 0 ? item.answer[0] : "" // Temporary solution
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
            value={initialAnswer}
            setValue={setValue}
          />
        )
      })}
    </>
  )
}
