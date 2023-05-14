import { BaseSuccessResponse } from "./base"
import { CheckboxItemDTO, RadioItemDTO, SelectorItemDTO, SliderItemDTO, TextItemDTO } from "./item"

export type ID = string

export interface GetActivityByIdPayload {
  activityId: ID
}

export type SuccessResponseActivityById = BaseSuccessResponse<ActivityDTO>

export type ActivityDTO = {
  id: ID
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
  appletId: ID
  version: string
  flowId: ID | null
  activityId: ID
  answers: string // Prev version: Array<AnswerTypesPayload>
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
    value: Array<ID>
    additionalText: string | null
  }
}

export type SingleSelectAnswerPayload = {
  activityItemId: string
  answer: {
    value: ID
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
