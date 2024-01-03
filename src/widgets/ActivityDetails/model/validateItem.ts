import { appletModel } from "~/entities/applet"
import { stringContainsOnlyNumbers } from "~/shared/utils"

type ValidateItemProps = {
  item: appletModel.ActivityEventProgressRecord
}

export function validateItem(props: ValidateItemProps) {
  if (props.item.responseType === "text" && props.item.config.correctAnswerRequired) {
    const isAnswerCorrect = props.item.answer[0] === props.item.config.correctAnswer

    return isAnswerCorrect
  }

  return true
}

export function validateIsItemAnswerShouldBeEmpty(currentItem: appletModel.ActivityEventProgressRecord) {
  const isMessageItem = currentItem.responseType === "message"
  const isAudioPlayerItem = currentItem.responseType === "audioPlayer"

  const isItemWithoutAnswer = isMessageItem || isAudioPlayerItem

  return isItemWithoutAnswer
}

export function validateIsNumericOnly(currentItem: appletModel.ActivityEventProgressRecord) {
  const isTextItem = currentItem.responseType === "text"

  if (!isTextItem) {
    return false
  }

  const isNumericOnly = currentItem.config.numericalResponseRequired

  if (isNumericOnly) {
    return !stringContainsOnlyNumbers(currentItem.answer[0])
  }

  return false
}
