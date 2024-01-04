import { EventProgressState } from "~/abstract/lib"
import {
  AudioPlayerItem,
  CheckboxItem,
  DateItem,
  MessageItem,
  RadioItem,
  SelectorItem,
  SliderItem,
  SplashScreenItem,
  TextItem,
  TimeItem,
  TimeRangeItem,
} from "~/entities/activity/lib"

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

export type ItemRecord =
  | TextItem
  | CheckboxItem
  | RadioItem
  | SliderItem
  | SelectorItem
  | SplashScreenItem
  | MessageItem
  | DateItem
  | TimeItem
  | TimeRangeItem
  | AudioPlayerItem

export type ActivityProgress = {
  items: ItemRecord[]
  step: number
  userEvents: Array<UserEvents>
}

export type ProgressState = Record<string, ActivityProgress>

// Payloads

export type SaveActivityProgressPayload = {
  activityId: string
  eventId: string
  progress: ActivityProgress
}

export type RemoveActivityProgressPayload = {
  activityId: string
  eventId: string
}

export type SaveGroupProgressPayload = {
  appletId: string
  activityId: string
  eventId: string
  progressPayload: EventProgressState
}

export type SaveItemAnswerPayload = {
  entityId: string
  eventId: string
  itemId: string
  answer: string[]
}

export type UpdateStepPayload = {
  activityId: string
  eventId: string
}

export type SaveUserEventPayload = {
  entityId: string
  eventId: string
  itemId: string
  userEvent: UserEvents
}

export type UpdateUserEventByIndexPayload = {
  entityId: string
  eventId: string
  userEventIndex: number
  userEvent: UserEvents
}

export type SupportableActivities = Record<string, boolean>

export type CompletedEntitiesState = Record<string, number>

export type EventCompletions = Record<string, number[]>

export type CompletedEventEntities = Record<string, EventCompletions>

export type InProgressEntity = {
  appletId: string
  entityId: string
  eventId: string
}

export type InProgressActivity = {
  appletId: string
  activityId: string
  eventId: string
}

export type InProgressFlow = {
  appletId: string
  flowId: string
  activityId: string
  eventId: string
  pipelineActivityOrder: number
}
