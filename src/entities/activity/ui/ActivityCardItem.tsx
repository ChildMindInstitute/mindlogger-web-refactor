import { useMemo } from "react"

import { useSaveActivityItemAnswer, useSetAnswerUserEvent } from "../model/hooks"
import { ActivityEventProgressRecord } from "../model/types"
import { ItemPicker } from "./items/ItemPicker"

import { CardItem } from "~/shared/ui"

type ActivityCardItemProps = {
  activityId: string
  eventId: string
  activityItem: ActivityEventProgressRecord
  watermark?: string
  allowToSkipAllItems?: boolean | undefined

  values: string[]
  replaceText: (value: string) => string
}

export const ActivityCardItem = ({
  activityItem,
  values,
  replaceText,
  watermark,
  activityId,
  eventId,
  allowToSkipAllItems,
}: ActivityCardItemProps) => {
  const { saveSetAnswerUserEvent } = useSetAnswerUserEvent({
    activityId,
    eventId,
  })
  const { saveActivityItemAnswer } = useSaveActivityItemAnswer({
    activityId,
    eventId,
  })

  const onItemValueChange = (value: string[]) => {
    saveActivityItemAnswer(activityItem.id, value)
    saveSetAnswerUserEvent({
      ...activityItem,
      answer: value,
    })
  }

  const questionText = useMemo(() => {
    return replaceText(activityItem.question)
  }, [activityItem.question, replaceText])

  return (
    <CardItem
      markdown={questionText}
      watermark={watermark}
      isOptional={activityItem.config.skippableItem || allowToSkipAllItems}>
      <ItemPicker
        item={activityItem}
        values={values}
        onValueChange={onItemValueChange}
        isDisabled={false}
        replaceText={replaceText}
      />
    </CardItem>
  )
}
