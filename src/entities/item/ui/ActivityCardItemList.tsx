import { PropsWithChildren } from "react"

import { ActivityEventProgressRecord } from "../../activity/model/types"
import { ActivityCardItem } from "./ActivityCardItem"

type ActivityCardItemListProps = PropsWithChildren<{
  items: ActivityEventProgressRecord[]
  isOnePageAssessment: boolean
  isBackShown: boolean
  isSubmitShown: boolean

  toNextStep: (itemId: string, answer: string) => void
  toPrevStep: () => void
}>

export const ActivityCardItemList = ({
  items,
  isBackShown,
  isOnePageAssessment,
  isSubmitShown,
  toNextStep,
  toPrevStep,
}: ActivityCardItemListProps) => {
  return (
    <>
      {items.map((item, index) => {
        const firstElement = 0
        const isActive = index === firstElement
        return (
          <ActivityCardItem
            key={item.id}
            activityItem={item}
            isBackShown={isBackShown}
            isOnePageAssessment={isOnePageAssessment}
            isSubmitShown={isSubmitShown}
            toNextStep={toNextStep}
            toPrevStep={toPrevStep}
            isActive={isActive}
          />
        )
      })}
    </>
  )
}
