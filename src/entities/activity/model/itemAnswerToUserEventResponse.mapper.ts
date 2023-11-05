import { ActivityEventProgressRecord, UserEventResponse } from "./types"

export const mapItemAnswerToUserEventResponse = (item: ActivityEventProgressRecord): UserEventResponse => {
  const responseType = item.responseType
  const itemAnswer = item.answer

  if (responseType === "singleSelect") {
    return {
      value: [Number(itemAnswer[0])],
    }
  }

  if (responseType === "multiSelect") {
    return {
      value: itemAnswer.map(answer => Number(answer)),
    }
  }

  return itemAnswer[0]
}
