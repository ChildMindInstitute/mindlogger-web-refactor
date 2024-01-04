import { useMemo } from "react"

import { ItemPicker } from "./items/ItemPicker"

import { appletModel } from "~/entities/applet"
import { SliderAnimation } from "~/shared/animations"
import { CardItem } from "~/shared/ui"

type ActivityCardItemProps = {
  item: appletModel.ItemRecord
  watermark?: string
  allowToSkipAllItems?: boolean | undefined

  values: string[]
  onValueChange: (value: string[]) => void

  replaceText: (value: string) => string

  step: number
  prevStep: number | null
}

export const ActivityCardItem = ({
  item,
  values,
  replaceText,
  watermark,
  allowToSkipAllItems,
  step,
  prevStep,
  onValueChange,
}: ActivityCardItemProps) => {
  const questionText = useMemo(() => {
    return replaceText(item.question)
  }, [item.question, replaceText])

  return (
    <SliderAnimation step={step} prevStep={prevStep ?? step}>
      <CardItem
        markdown={questionText}
        watermark={watermark}
        isOptional={item.config.skippableItem || allowToSkipAllItems}>
        <ItemPicker
          item={item}
          values={values}
          onValueChange={onValueChange}
          isDisabled={false}
          replaceText={replaceText}
        />
      </CardItem>
    </SliderAnimation>
  )
}
