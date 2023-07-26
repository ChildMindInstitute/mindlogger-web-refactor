import { ItemAnswer } from "./itemAnswer"

import { CheckboxItem, RadioItem, SelectorItem, SliderItem, TextItem, activityModel } from "~/entities/activity"
import {
  AlertDTO,
  MultiSelectAnswerPayload,
  SingleSelectAnswerPayload,
  SliderAnswerPayload,
  TextAnswerPayload,
} from "~/shared/api"

export function mapToAnswers(items: Array<activityModel.types.ActivityEventProgressRecord>): Array<ItemAnswer> {
  const answers = items.map(item => {
    switch (item.responseType) {
      case "text":
        return convertToTextAnswer(item)

      case "singleSelect":
        return convertToSingleSelectAnswer(item)

      case "multiSelect":
        return convertToMultiSelectAnswer(item)

      case "slider":
        return convertToSliderAnswer(item)

      case "numberSelect":
        return convertToNumberSelectAnswer(item)

      default:
        return null
    }
  })

  return answers as Array<ItemAnswer>
}

function convertToTextAnswer(item: TextItem): { answer: TextAnswerPayload | null; itemId: string } {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    }
  }

  return {
    answer: item.answer[0],
    itemId: item.id,
  }
}

function convertToSingleSelectAnswer(item: RadioItem): {
  answer: SingleSelectAnswerPayload | null
  itemId: string
} {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    }
  }

  return {
    answer: {
      value: Number(item.answer[0]),
      text: null,
    },
    itemId: item.id,
  }
}

function convertToMultiSelectAnswer(item: CheckboxItem): {
  answer: MultiSelectAnswerPayload | null
  itemId: string
} {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    }
  }

  return {
    answer: {
      value: item.answer.map(strValue => Number(strValue)),
      text: null,
    },
    itemId: item.id,
  }
}

function convertToSliderAnswer(item: SliderItem): {
  answer: SliderAnswerPayload | null
  itemId: string
} {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    }
  }

  return {
    answer: {
      value: Number(item.answer[0]),
      text: null,
    },
    itemId: item.id,
  }
}

function convertToNumberSelectAnswer(item: SelectorItem) {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    }
  }

  return {
    answer: {
      value: item.answer[0],
      text: null,
    },
    itemId: item.id,
  }
}

export function mapAlerts(items: Array<activityModel.types.ActivityEventProgressRecord>): Array<AlertDTO> {
  const alerts = items.map(item => {
    switch (item.responseType) {
      case "singleSelect":
        return convertSingleSelectToAlert(item)

      case "multiSelect":
        return convertMultiSelectToAlert(item)

      case "slider":
        return convertSliderToAlert(item)

      default:
        return null
    }
  })

  return alerts.filter(alert => alert !== null).flat() as Array<AlertDTO>
}

function convertSingleSelectToAlert(item: RadioItem): Array<AlertDTO> {
  const alert: Array<AlertDTO> = []

  if (item.config.setAlerts && item.answer.length > 0) {
    const option = item.responseValues.options.find(option => option.value === Number(item.answer[0]))

    if (option && option.alert) {
      alert.push({
        activityItemId: item.id,
        message: option.alert,
      })
    }
  }

  return alert
}

function convertMultiSelectToAlert(item: CheckboxItem): Array<AlertDTO> {
  const alert: Array<AlertDTO> = []

  if (item.config.setAlerts && item.answer.length > 0) {
    item.responseValues.options.forEach(option => {
      const answeredOption = item.answer.includes(String(option.value))

      if (answeredOption && option.alert) {
        alert.push({
          activityItemId: item.id,
          message: option.alert,
        })
      }
    })
  }

  return alert
}

function convertSliderToAlert(item: SliderItem): Array<AlertDTO> {
  const alert: Array<AlertDTO> = []

  if (item.config.setAlerts && item.answer.length > 0) {
    item.responseValues.alerts?.forEach(alertItem => {
      const answer = Number(item.answer[0])

      if (alertItem.minValue < answer && alertItem.maxValue > answer) {
        alert.push({
          activityItemId: item.id,
          message: alertItem.alert,
        })
      }

      if (!alertItem.minValue && !alertItem.maxValue && alertItem.value === answer) {
        alert.push({
          activityItemId: item.id,
          message: alertItem.alert,
        })
      }
    })
  }

  return alert
}
