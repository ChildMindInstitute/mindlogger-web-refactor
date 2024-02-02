import { ItemRecord, UserEventResponse } from "./types"

import { ActivityItemDetailsDTO } from "~/shared/api"

export const mapItemAnswerToUserEventResponse = (item: ItemRecord): UserEventResponse => {
  const responseType = item.responseType
  const itemAnswer = item.answer

  if (responseType === "singleSelect") {
    return {
      value: [Number(itemAnswer[0])],
      text: item.additionalText ?? undefined,
    }
  }

  if (responseType === "multiSelect") {
    return {
      value: itemAnswer.map(answer => Number(answer)),
      text: item.additionalText ?? undefined,
    }
  }

  return {
    value: itemAnswer[0],
    text: item.additionalText ?? undefined,
  }
}

export function mapItemToRecord(item: ActivityItemDetailsDTO): ItemRecord {
  if (item.responseType === "message") {
    return {
      ...item,
      config: {
        ...item.config,
        skippableItem: false,
      },
      answer: [],
    }
  }

  return {
    ...item,
    answer: [],
  }
}

export function mapSplashScreenToRecord(splashScreen: string): ItemRecord {
  return {
    id: splashScreen,
    name: "",
    question: "",
    order: 0,
    responseType: "splashScreen",
    config: {
      removeBackButton: true,
      skippableItem: true,
      imageSrc: splashScreen,
    },
    responseValues: null,
    answer: [],
    conditionalLogic: null,
  }
}
