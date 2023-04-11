import { BaseSuccessResponse } from "./base"
import { CheckboxItemDTO, RadioItemDTO, SelectorItemDTO, SliderItemDTO, TextItemDTO } from "./item"

export interface GetActivityByIdPayload {
  activityId: string
}

export type SuccessResponseActivityById = BaseSuccessResponse<ActivityDTO>

export type ActivityDTO = {
  id: string
  guid: string
  name: string
  description: string
  splashScreen: string | ""
  image: string | ""
  showAllAtOnce: boolean
  isSkippable: boolean
  isReviewable: boolean
  responseIsEditable: boolean
  ordering: number
  items: ActivityItemDetailsDTO[]
}

export type ActivityItemDetailsDTO = TextItemDTO | CheckboxItemDTO | RadioItemDTO | SliderItemDTO | SelectorItemDTO

export type AnswerPayload = {
  appletId: string
  version: string
  flowId: string | null
  activityId: string
  answers: Array<AnswerTypesPayload>
}

export type AnswerTypesPayload =
  | TextAnswerPayload
  | MultiSelectAnswerPayload
  | SingleSelectAnswerPayload
  | SliderAnswerPayload

export type TextAnswerPayload = {
  activityItemId: string
  answer: {
    value: string
    shouldIdentifyResponse: boolean
  }
}

export type MultiSelectAnswerPayload = {
  activityItemId: string
  answer: {
    value: Array<string> // Array of IDs
    additionalText: string | null
  }
}

export type SingleSelectAnswerPayload = {
  activityItemId: string
  answer: {
    value: string // ID
    additionalText: string | null
  }
}

export type SliderAnswerPayload = {
  activityItemId: string
  answer: {
    value: number
    additionalText: string | null
  }
}
