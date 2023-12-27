import { CheckboxItem, RadioItem, SelectorItem, SliderItem, SplashScreenItem, TextItem } from "../lib"

import { EventProgressState } from "~/abstract/lib"

export type UserEventTypes = "SET_ANSWER" | "PREV" | "NEXT" | "SKIP" | "DONE"

export type UserEventResponse =
  | string
  | {
      value: number[]
    }

export type UserEvents = {
  type: UserEventTypes
  time: number
  screen: string
  response?: UserEventResponse
}

export type ActivityEventProgressRecord =
  | TextItem
  | CheckboxItem
  | RadioItem
  | SliderItem
  | SelectorItem
  | SplashScreenItem

export type ActivityEventProgressState = {
  activityEvents: ActivityEventProgressRecord[]
  step: number
  userEvents: Array<UserEvents>
}

export type ActivityEventState = Record<string, ActivityEventProgressState>

// Payloads
export type ClearActivityItemsProgresByIdPayload = {
  activityEventId: string
}

export type UpsertActionPayload = {
  appletId: string
  activityId: string
  eventId: string
  progressPayload: EventProgressState
}

export type SaveActivityItemAnswerPayload = {
  activityEventId: string
  itemId: string
  answer: string[]
}

export type SetActivityEventProgressStep = {
  activityEventId: string
  step: number
}

export type SetUserEventByItemIdPayload = {
  activityEventId: string
  itemId: string
  userEvent: UserEvents
}

export type UpdateUserEventByIndexPayload = {
  activityEventId: string
  itemId: string
  userEventIndex: number
  userEvent: UserEvents
}

export type SupportableActivities = Record<string, boolean>

export type InProgressEntity = {
  appletId: string
  entityId: string
  eventId: string
}
