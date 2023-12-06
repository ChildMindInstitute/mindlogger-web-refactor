export const enum ActivityPipelineType {
  NotDefined = 0,
  Regular,
  Flow,
}

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

export type ActivityOrFlowProgress = FlowProgress | ActivityProgress

type EventProgressTimestampState = {
  startAt: number | null
  endAt: number | null
}

type AppletId = string
type EntityId = string
type EventId = string

export type EventProgressState = ActivityOrFlowProgress & EventProgressTimestampState

export type EventsProgress = Record<EventId, EventProgressState>

export type EntitiesProgress = Record<EntityId, EventsProgress>

export type Progress = Record<AppletId, EntitiesProgress>
