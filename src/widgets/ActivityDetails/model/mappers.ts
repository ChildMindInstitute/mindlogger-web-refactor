import { ItemAnswer } from "./itemAnswer"

import {
  AudioPlayerItem,
  CheckboxItem,
  DateItem,
  MessageItem,
  RadioItem,
  SelectorItem,
  SliderItem,
  TextItem,
  TimeItem,
  TimeRangeItem,
} from "~/entities/activity"
import { appletModel } from "~/entities/applet"
import {
  AlertDTO,
  AnswerTypesPayload,
  AudioPlayerAnswerPayload,
  DateAnswerPayload,
  MessageAnswerPayload,
  MultiSelectAnswerPayload,
  NumberSelectAnswerPayload,
  SingleSelectAnswerPayload,
  SliderAnswerPayload,
  TextAnswerPayload,
  TimeAnswerPayload,
  TimeRangeAnswerPayload,
} from "~/shared/api"
import { dateToDayMonthYearDTO, dateToHourMinuteDTO } from "~/shared/utils"

export function mapToAnswers(
  items: Array<appletModel.ActivityEventProgressRecord>,
): Array<ItemAnswer<AnswerTypesPayload>> {
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

      case "message":
        return convertToMessageAnswer(item)

      case "date":
        return convertToDateAnswer(item)

      case "time":
        return convertToTimeAnswer(item)

      case "timeRange":
        return convertToTimeRangeAnswer(item)

      case "audioPlayer":
        return convertToAudioPlayerAnswer(item)

      default:
        return null
    }
  })

  return answers as Array<ItemAnswer<AnswerTypesPayload>>
}

function convertToTextAnswer(item: TextItem): ItemAnswer<TextAnswerPayload> {
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

function convertToSingleSelectAnswer(item: RadioItem): ItemAnswer<SingleSelectAnswerPayload> {
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

function convertToMultiSelectAnswer(item: CheckboxItem): ItemAnswer<MultiSelectAnswerPayload> {
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

function convertToSliderAnswer(item: SliderItem): ItemAnswer<SliderAnswerPayload> {
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

function convertToNumberSelectAnswer(item: SelectorItem): ItemAnswer<NumberSelectAnswerPayload> {
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

function convertToMessageAnswer(item: MessageItem): ItemAnswer<MessageAnswerPayload> {
  return {
    answer: null,
    itemId: item.id,
  }
}

function convertToDateAnswer(item: DateItem): ItemAnswer<DateAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    }
  }

  return {
    answer: {
      value: dateToDayMonthYearDTO(new Date(item.answer[0])),
      text: null,
    },
    itemId: item.id,
  }
}

function convertToTimeAnswer(item: TimeItem): ItemAnswer<TimeAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    }
  }

  return {
    answer: {
      value: dateToHourMinuteDTO(new Date(item.answer[0])),
      text: null,
    },
    itemId: item.id,
  }
}

function convertToTimeRangeAnswer(item: TimeRangeItem): ItemAnswer<TimeRangeAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    }
  }

  return {
    answer: {
      value: {
        startTime: dateToHourMinuteDTO(new Date(item.answer[0])),
        endTime: dateToHourMinuteDTO(new Date(item.answer[1])),
      },
      text: null,
    },
    itemId: item.id,
  }
}

function convertToAudioPlayerAnswer(item: AudioPlayerItem): ItemAnswer<AudioPlayerAnswerPayload> {
  return {
    answer: null,
    itemId: item.id,
  }
}

export function mapAlerts(items: Array<appletModel.ActivityEventProgressRecord>): Array<AlertDTO> {
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
