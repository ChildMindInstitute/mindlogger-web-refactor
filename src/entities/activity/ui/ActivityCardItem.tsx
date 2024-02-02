import { useMemo } from "react"

import { AdditionalTextResponse } from "./AdditionalTextResponse"
import { ItemPicker } from "./items/ItemPicker"
import { hasAdditionalResponse, requiresAdditionalResponse } from "../lib"

import { appletModel } from "~/entities/applet"
import { SliderAnimation } from "~/shared/animations"
import { CardItem } from "~/shared/ui"
import { useCustomTranslation } from "~/shared/utils"

type ActivityCardItemProps = {
  item: appletModel.ItemRecord
  watermark?: string
  allowToSkipAllItems?: boolean | undefined

  onValueChange: (value: string[]) => void

  onItemAdditionalTextChange: (value: string) => void

  replaceText: (value: string) => string

  step: number
  prevStep: number | null
}

export const ActivityCardItem = ({
  item,
  replaceText,
  watermark,
  allowToSkipAllItems,
  step,
  prevStep,
  onValueChange,
  onItemAdditionalTextChange,
}: ActivityCardItemProps) => {
  const questionText = useMemo(() => {
    return replaceText(item.question)
  }, [item.question, replaceText])

  const isOptionalFlagHidden = ["message", "audioPlayer", "splashScreen"].includes(item.responseType)

  const { t } = useCustomTranslation()

  return (
    <SliderAnimation step={step} prevStep={prevStep ?? step}>
      <CardItem
        markdown={questionText}
        watermark={watermark}
        isOptional={!isOptionalFlagHidden && (item.config.skippableItem || allowToSkipAllItems)}>
        <ItemPicker item={item} onValueChange={onValueChange} isDisabled={false} replaceText={replaceText} />
      </CardItem>
      {hasAdditionalResponse(item) && (
        <CardItem
          markdown={t("additional.additional_text")}
          watermark={watermark}
          isOptional={!requiresAdditionalResponse(item)}>
          <AdditionalTextResponse value={item.additionalText || ""} onValueChange={onItemAdditionalTextChange} />
        </CardItem>
      )}
    </SliderAnimation>
  )
}
