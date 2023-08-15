import {
  ActivityPipelineType,
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
} from "../lib"

export type FlowProgress = {
  type: ActivityPipelineType.Flow
  currentActivityId: string
  pipelineActivityOrder: number
  currentActivityStartAt: number | null
  executionGroupKey: string
}

export type ActivityProgress = {
  type: ActivityPipelineType.Regular
}

type ActivityOrFlowProgress = FlowProgress | ActivityProgress

type EventProgressTimestampState = {
  startAt: number | null
  endAt: number | null
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

export type ProgressState = ActivityOrFlowProgress & EventProgressTimestampState

export type ActivityProgressState = Record<string, ProgressState>
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
  | DateItem
  | TimeItem
  | TimeRangeItem
  | AudioPlayerItem

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
  progressPayload: ProgressState
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

export type CompletedEntitiesState = Record<string, number>

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
