import {
  ActivityPipelineType,
  CheckboxItem,
  MessageItem,
  RadioItem,
  SelectorItem,
  SliderItem,
  SplashScreenItem,
  TextItem,
} from "../lib"

type ActivityFlowProgress = {
  type: ActivityPipelineType.Flow
  currentActivityId: string
  pipelineActivityOrder: number
}

type ActivityProgress = {
  type: ActivityPipelineType.Regular
}

type ActivityOrFlowProgress = ActivityFlowProgress | ActivityProgress

type EventProgressTimestampState = {
  startAt: Date | null
  endAt: Date | null
}

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

export type EventProgressState = ActivityOrFlowProgress & EventProgressTimestampState

export type ActivityProgressState = Record<string, EventProgressState>
export type AppletProgressState = Record<string, ActivityProgressState>

export type GroupsProgressState = Record<string, AppletProgressState>

export type ActivityEventProgressRecord =
  | TextItem
  | CheckboxItem
  | RadioItem
  | SliderItem
  | SelectorItem
  | SplashScreenItem
  | MessageItem

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

export type UpdateActionPayload = {
  appletId: string
  activityId: string
  eventId: string
  progressPayload: Partial<EventProgressTimestampState>
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
