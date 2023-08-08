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
