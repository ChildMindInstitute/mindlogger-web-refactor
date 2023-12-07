import { useMemo } from "react"

import { ItemCardButtonsConfig } from "../lib"
import { ActivityEventProgressRecord, UserEventTypes } from "../model/types"
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
  saveUserEventByType: (type: UserEventTypes, item: ActivityEventProgressRecord) => void
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
  saveUserEventByType,
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

    saveUserEventByType("DONE", activityItem)
    return onSubmitButtonClick()
  }

  const onItemValueChange = (value: string[]) => {
    setValue(activityItem.id, value)
    saveSetAnswerUserEvent({
      ...activityItem,
      answer: value,
    })
  }

  const onNextButtonClick = () => {
    if (!toNextStep) {
      return
    }

    const isAnswerCorrect = validateCorrectAnswer()

    if (!isAnswerCorrect && !isAllItemsSkippable && !activityItem.config.skippableItem) {
      return openInvalidAnswerModal()
    }

    if (!activityItem.answer.length && (isAllItemsSkippable || activityItem.config.skippableItem)) {
      saveUserEventByType("SKIP", activityItem)
    } else {
      saveUserEventByType("NEXT", activityItem)
    }

    return toNextStep()
  }

  const onBackButtonClick = () => {
    if (!toPrevStep) {
      return
    }

    const hasConditionalLogic = activityItem.conditionalLogic

    if (hasConditionalLogic) {
      // If the current item participate in any conditional logic
      // we need to reset the answer to the initial state
      onItemValueChange([])
    }

    saveUserEventByType("PREV", activityItem)
    return toPrevStep()
  }

  const questionText = useMemo(() => {
    return replaceText(activityItem.question)
  }, [activityItem.question, replaceText])

  return (
    <div data-testid={isActive ? "active-item" : undefined}>
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
    </div>
  )
}
