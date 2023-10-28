import { activityModel } from "~/entities/activity"
import { stringContainsOnlyNumbers } from "~/shared/utils"

type ValidateItemProps = {
  item: activityModel.types.ActivityEventProgressRecord
}

export function validateItem(props: ValidateItemProps) {
  if (props.item.responseType === "text" && props.item.config.correctAnswerRequired) {
    const isAnswerCorrect = props.item.answer[0] === props.item.config.correctAnswer

    return isAnswerCorrect
  }

  return true
}

export function validateIsItemWithoutAnswer(currentItem: activityModel.types.ActivityEventProgressRecord) {
  const isMessageItem = currentItem.responseType === "message"
  const isAudioPlayerItem = currentItem.responseType === "audioPlayer"

  const isItemWithoutAnswer = isMessageItem || isAudioPlayerItem

  return isItemWithoutAnswer
}

export function validateIsNumericOnly(currentItem: activityModel.types.ActivityEventProgressRecord) {
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
