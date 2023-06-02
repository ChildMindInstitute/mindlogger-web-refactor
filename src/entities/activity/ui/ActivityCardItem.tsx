import { useMemo } from "react"

import { ItemCardButtonsConfig } from "../lib"
import { ActivityEventProgressRecord } from "../model/types"
import { ItemCardButton } from "./ItemCardButtons"
import { ItemPicker } from "./items/ItemPicker"

import { CardItem } from "~/shared/ui"

type ActivityCardItemProps = {
  activityItem: ActivityEventProgressRecord
  isOnePageAssessment: boolean
  isBackShown: boolean
  isSubmitShown: boolean
  isAllItemsSkippable: boolean
  watermark?: string

  isInvalid: boolean
  isActive: boolean
  onSubmitButtonClick: () => void
  openInvalidAnswerModal: () => void
  toNextStep?: () => void
  toPrevStep?: () => void
  values: string[]
  setValue: (itemId: string, answer: string[]) => void
  saveSetAnswerUserEvent: (item: ActivityEventProgressRecord) => void
  replaceText: (value: string) => string
}

export const ActivityCardItem = ({
  activityItem,
  isOnePageAssessment,
  isBackShown,
  isSubmitShown,
  toNextStep,
  toPrevStep,
  isActive,
  isInvalid,
  values,
  setValue,
  onSubmitButtonClick,
  openInvalidAnswerModal,
  replaceText,
  isAllItemsSkippable,
  watermark,
  saveSetAnswerUserEvent,
}: ActivityCardItemProps) => {
  const buttonConfig: ItemCardButtonsConfig = {
    isNextDisable: !values || !values.length,
    isSkippable: activityItem.config.skippableItem || isAllItemsSkippable,
    isBackShown: isBackShown && !activityItem.config.removeBackButton,
  }

  const validateCorrectAnswer = () => {
    if (activityItem.responseType === "text" && activityItem.config.correctAnswerRequired) {
      const isAnswerCorrect = activityItem.answer[0] === activityItem.config.correctAnswer

      return isAnswerCorrect
    }

    return true
  }

  const onSubmitButtonHandleClick = () => {
    const isAnswerCorrect = validateCorrectAnswer()

    if (!isAnswerCorrect && !isAllItemsSkippable && !activityItem.config.skippableItem) {
      return openInvalidAnswerModal()
    }

    return onSubmitButtonClick()
  }

  const onNextButtonClick = () => {
    if (!toNextStep) {
      return
    }

    const isAnswerCorrect = validateCorrectAnswer()

    if (!isAnswerCorrect && !isAllItemsSkippable && !activityItem.config.skippableItem) {
      return openInvalidAnswerModal()
    }

    return toNextStep()
  }

  const onBackButtonClick = () => {
    if (!toPrevStep) {
      return
    }

    return toPrevStep()
  }

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
    <CardItem
      markdown={questionText}
      isInvalid={isInvalid}
      watermark={watermark}
      buttons={
        isActive ? (
          <ItemCardButton
            config={buttonConfig}
            isOnePageAssessment={isOnePageAssessment}
            isSubmitShown={isSubmitShown}
            onNextButtonClick={onNextButtonClick}
            onBackButtonClick={onBackButtonClick}
            onSubmitButtonClick={onSubmitButtonHandleClick}
          />
        ) : (
          <></>
        )
      }>
      <ItemPicker
        item={activityItem}
        values={values}
        onValueChange={onItemValueChange}
        isDisabled={!isActive}
        replaceText={replaceText}
      />
    </CardItem>
  )
}
