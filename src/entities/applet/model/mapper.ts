import { ItemRecord, UserEventResponse } from "./types"

import { ActivityItemDetailsDTO } from "~/shared/api"
import { dateToDayMonthYear, dateToHourMinute } from "~/shared/utils"

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

  if (responseType === "date") {
    return {
      value: dateToDayMonthYear(new Date(itemAnswer[0])),
      text: item.additionalText ?? undefined,
    }
  }

  if (responseType === "time") {
    return {
      value: dateToHourMinute(new Date(itemAnswer[0])),
      text: item.additionalText ?? undefined,
    }
  }

  if (responseType === "timeRange") {
    const fromDate = itemAnswer[0] ? new Date(itemAnswer[0]) : new Date()
    const toDate = itemAnswer[1] ? new Date(itemAnswer[1]) : new Date()

    return {
      value: {
        from: { hour: fromDate.getHours(), minute: fromDate.getMinutes() },
        to: { hour: toDate.getHours(), minute: toDate.getMinutes() },
      },
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
    isHidden: false,
  }
}
