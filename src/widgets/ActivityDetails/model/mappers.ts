import { ItemAnswer } from "./itemAnswer"

import {
  CheckboxItem,
  DateItem,
  MessageItem,
  RadioItem,
  SelectorItem,
  SliderItem,
  TextItem,
  TimeItem,
  TimeRangeItem,
  activityModel,
} from "~/entities/activity"
import {
  AnswerTypesPayload,
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
  items: Array<activityModel.types.ActivityEventProgressRecord>,
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
