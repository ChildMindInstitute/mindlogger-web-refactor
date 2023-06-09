import { BaseSuccessResponse } from "./base"
import { CheckboxItemDTO, RadioItemDTO, SelectorItemDTO, SliderItemDTO, TextItemDTO } from "./item"

export type ID = string

export interface GetActivityByIdPayload {
  activityId: ID
}

export type GetPublicActivityById = {
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
  submitId: ID
  flowId: ID | null
  activityId: ID
  answer: {
    answer: string // Encrypted answer DTO: Array<string | { value: string | string[] | number, text: string | null }>
    events: string // Encrypted user actions DTO
    itemIds: Array<ID>
    identifier: string | null
    scheduledTime?: number
    startTime: number
    endTime: number
    userPublicKey: string
  }
}

export type AnswerTypesPayload =
  | TextAnswerPayload
  | MultiSelectAnswerPayload
  | SingleSelectAnswerPayload
  | SliderAnswerPayload

export type TextAnswerPayload = string

export type MultiSelectAnswerPayload = {
  value: Array<ID>
  text: string | null
}

export type SingleSelectAnswerPayload = {
  value: ID
  text: string | null
}

export type SliderAnswerPayload = {
  value: number
  text: string | null
}
