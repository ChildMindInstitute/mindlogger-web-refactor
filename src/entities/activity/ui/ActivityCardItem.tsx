import { useMemo } from "react"

import { ActivityEventProgressRecord } from "../model/types"
import { ItemPicker } from "./items/ItemPicker"

import { CardItem } from "~/shared/ui"

type ActivityCardItemProps = {
  activityItem: ActivityEventProgressRecord
  watermark?: string

  values: string[]
  setValue: (itemId: string, answer: string[]) => void
  saveSetAnswerUserEvent: (item: ActivityEventProgressRecord) => void
  replaceText: (value: string) => string
}

export const ActivityCardItem = ({
  activityItem,
  values,
  setValue,
  replaceText,
  watermark,
  saveSetAnswerUserEvent,
}: ActivityCardItemProps) => {
  const onItemValueChange = (value: string[]) => {
    setValue(activityItem.id, value)
    saveSetAnswerUserEvent({
      ...activityItem,
      answer: value,
    })
  }

  const questionText = useMemo(() => {
    return replaceText(activityItem.question)
  }, [activityItem.question, replaceText])

  return (
    <div data-testid={"active-item"}>
      <CardItem markdown={questionText} isInvalid={false} watermark={watermark} buttons={<></>}>
        <ItemPicker
          item={activityItem}
          values={values}
          onValueChange={onItemValueChange}
          isDisabled={false}
          replaceText={replaceText}
        />
      </CardItem>
    </div>
  )
}
