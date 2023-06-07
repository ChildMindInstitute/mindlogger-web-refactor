import { ActivityEventProgressRecord, UserEventResponse } from "./types"

export const mapItemAnswerToUserEventResponse = (item: ActivityEventProgressRecord): UserEventResponse => {
  const responseType = item.responseType
  const itemAnswer = item.answer

  if (responseType === "singleSelect") {
    const itemResponseValues = item.responseValues
    const answerOptionIndex = itemResponseValues.options.findIndex(option => option.id === itemAnswer[0])
    return {
      value: [answerOptionIndex],
    }
  }

  if (responseType === "multiSelect") {
    const itemResponseValues = item.responseValues
    const optionIndex = itemAnswer.map(answer => {
      const answerOptionIndex = itemResponseValues.options.findIndex(option => option.id === answer)
      return answerOptionIndex
    })

    return {
      value: optionIndex,
    }
  }

  return itemAnswer[0]
}
