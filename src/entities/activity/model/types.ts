import { ActivityPipelineType, BaseItem, CheckboxConfig, CheckboxValues, TextItemConfig } from "../lib"

type ActivityFlowProgress = {
  type: ActivityPipelineType.Flow
  currentActivityId: string
}

type ActivityProgress = {
  type: ActivityPipelineType.Regular
}

type ActivityOrFlowProgress = ActivityFlowProgress | ActivityProgress

export type EventProgressState = ActivityOrFlowProgress & {
  startAt: Date | null
  endAt: Date | null
}

export type ActivityProgressState = Record<string, EventProgressState>
export type AppletProgressState = Record<string, ActivityProgressState>

export type GroupsProgressState = Record<string, AppletProgressState>

export type TextItem = BaseItem<TextItemConfig, null>
export type CheckboxItem = BaseItem<CheckboxConfig, CheckboxValues>

export type ActivityEventProgressRecord = TextItem | CheckboxItem

export type ActivityEventProgressState = {
  activityEvents: ActivityEventProgressRecord[]
  step: number
}

export type ActivityEventState = Record<string, ActivityEventProgressState>

// Payloads
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
