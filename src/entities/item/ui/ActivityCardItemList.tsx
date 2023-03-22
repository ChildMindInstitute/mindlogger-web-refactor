import { PropsWithChildren } from "react"

import { ActivityEventProgressRecord } from "../../activity/model/types"
import { ActivityCardItem } from "./ActivityCardItem"

type ActivityCardItemListProps = PropsWithChildren<{
  items: ActivityEventProgressRecord[]
  isOnePageAssessment: boolean
  isBackShown: boolean
  isSubmitShown: boolean

  toNextStep: () => void
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
      {items.map(item => (
        <ActivityCardItem
          key={item.id}
          activityItem={item}
          isBackShown={isBackShown}
          isOnePageAssessment={isOnePageAssessment}
          isSubmitShown={isSubmitShown}
          toNextStep={toNextStep}
          toPrevStep={toPrevStep}
        />
      ))}
    </>
  )
}
