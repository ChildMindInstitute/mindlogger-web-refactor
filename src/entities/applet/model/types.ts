import { GroupProgress } from "~/abstract/lib"
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
      text?: string
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

export type ItemWithAdditionalResponse = Extract<
  ItemRecord,
  CheckboxItem | RadioItem | SliderItem | SelectorItem | DateItem | TimeItem | TimeRangeItem | AudioPlayerItem
>

export type ActivityProgress = {
  items: ItemRecord[]
  step: number
  userEvents: Array<UserEvents>
}

type ProgressId = string // Progress ID is a combination of activityId and eventId (activityId/eventId)

export type ProgressState = Record<ProgressId, ActivityProgress>

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
  activityId: string
  eventId: string
  progressPayload: GroupProgress
}

export type SaveItemAnswerPayload = {
  entityId: string
  eventId: string
  itemId: string
  answer: string[]
}

export type SaveItemAdditionalTextPayload = {
  entityId: string
  eventId: string
  itemId: string
  additionalText: string
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
  entityId: string
  eventId: string
}

export type InProgressActivity = {
  activityId: string
  eventId: string
}

export type InProgressFlow = {
  flowId: string
  activityId: string
  eventId: string
  pipelineActivityOrder: number
}
