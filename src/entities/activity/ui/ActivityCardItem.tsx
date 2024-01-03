import { useMemo } from "react"

import { ItemPicker } from "./items/ItemPicker"

import { appletModel } from "~/entities/applet"
import { SliderAnimation } from "~/shared/animations"
import { CardItem } from "~/shared/ui"

type ActivityCardItemProps = {
  activityId: string
  eventId: string
  activityItem: appletModel.ItemRecord
  watermark?: string
  allowToSkipAllItems?: boolean | undefined

  values: string[]
  replaceText: (value: string) => string

  step: number
  prevStep: number | null
}

export const ActivityCardItem = ({
  activityItem,
  values,
  replaceText,
  watermark,
  activityId,
  eventId,
  allowToSkipAllItems,
  step,
  prevStep,
}: ActivityCardItemProps) => {
  const { saveSetAnswerUserEvent } = appletModel.hooks.useUserEvents({
    activityId,
    eventId,
  })
  const { saveItemAnswer } = appletModel.hooks.useSaveItemAnswer({
    activityId,
    eventId,
  })

  const onItemValueChange = (value: string[]) => {
    saveItemAnswer(activityItem.id, value)
    saveSetAnswerUserEvent({
      ...activityItem,
      answer: value,
    })
  }

  const questionText = useMemo(() => {
    return replaceText(activityItem.question)
  }, [activityItem.question, replaceText])

  return (
    <SliderAnimation step={step} prevStep={prevStep ?? step}>
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
    </SliderAnimation>
  )
}
