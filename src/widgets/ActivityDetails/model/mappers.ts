import { ItemAnswer } from "./itemAnswer"

import { CheckboxItem, RadioItem, SliderItem, TextItem, activityModel } from "~/entities/activity"
import {
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
        return null

      default:
        return null
    }
  })

  return answers.filter(x => x?.answer) as Array<ItemAnswer>
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

function convertToSingleSelectAnswer(item: RadioItem): { answer: SingleSelectAnswerPayload | null; itemId: string } {
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

function convertToMultiSelectAnswer(item: CheckboxItem): { answer: MultiSelectAnswerPayload | null; itemId: string } {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    }
  }

  return {
    answer: {
      value: item.answer,
      text: null,
    },
    itemId: item.id,
  }
}

function convertToSliderAnswer(item: SliderItem): { answer: SliderAnswerPayload | null; itemId: string } {
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