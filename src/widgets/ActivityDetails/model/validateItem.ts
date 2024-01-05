import { appletModel } from "~/entities/applet"
import { stringContainsOnlyNumbers } from "~/shared/utils"

export function isAnswerShouldBeCorrect(item: appletModel.ItemRecord) {
  if (item.responseType === "text" && item.config.correctAnswerRequired) {
    const isAnswerCorrect = item.answer[0] === item.config.correctAnswer

    return isAnswerCorrect
  }

  return true
}

export function isAnswerShouldBeEmpty(item: appletModel.ItemRecord) {
  const isMessageItem = item.responseType === "message"
  const isAudioPlayerItem = item.responseType === "audioPlayer"

  const isItemWithoutAnswer = isMessageItem || isAudioPlayerItem

  return isItemWithoutAnswer
}

export function isAnswerShouldBeNumeric(item: appletModel.ItemRecord) {
  const isTextItem = item.responseType === "text"

  if (!isTextItem) {
    return false
  }

  const isNumericOnly = item.config.numericalResponseRequired

  if (isNumericOnly) {
    return !stringContainsOnlyNumbers(item.answer[0])
  }

  return false
}
