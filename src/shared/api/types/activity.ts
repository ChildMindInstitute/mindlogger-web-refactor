import { BaseSuccessResponse } from "./base"
import { CheckboxItemDTO, RadioItemDTO, SelectorItemDTO, SliderItemDTO, TextItemDTO } from "./item"

export type ID = string

export interface GetActivityByIdPayload {
  activityId: ID
}

export interface GetCompletedEntitiesPayload {
  appletId: ID
  version: string
  fromDate: string // example: 2022-01-01
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
  isFlowCompleted: boolean | null
  createdAt: number
  answer: {
    answer: string // Encrypted answer DTO: Array<string | { value: string | string[] | number, text: string | null }>
    events: string // Encrypted user actions DTO
    itemIds: Array<ID>
    identifier: string | null
    scheduledTime?: number
    startTime: number
    endTime: number
    userPublicKey: string
    scheduledEventId: string
    localEndDate: string
    localEndTime: string
  }
  alerts: Array<AlertDTO>
  client: {
    appId: "mindlogger-web"
    appVersion: string
    width: number
    height: number
  }
}

export type AlertDTO = {
  activityItemId: string
  message: string
}

export type AnswerTypesPayload =
  | SkippedAnswerPayload
  | TextAnswerPayload
  | MultiSelectAnswerPayload
  | SingleSelectAnswerPayload
  | SliderAnswerPayload
  | NumberSelectAnswerPayload

export type SkippedAnswerPayload = null

export type TextAnswerPayload = string

export type MultiSelectAnswerPayload = {
  value: Array<number>
  text: string | null
}

export type SingleSelectAnswerPayload = {
  value: number
  text: string | null
}

export type SliderAnswerPayload = {
  value: number
  text: string | null
}

export type NumberSelectAnswerPayload = {
  value: number
  text: string | null
}

export type CompletedEntityDTO = {
  id: string
  answerId: string
  submitId: string
  scheduledEventId: string
  localEndDate: string
  localEndTime: string
}

export type CompletedEntitiesDTO = {
  id: string
  version: string
  activities: Array<CompletedEntityDTO>
  activityFlows: Array<CompletedEntityDTO>
}

export type CompletedEntitiesDTOSuccessResponse = BaseSuccessResponse<CompletedEntitiesDTO>
