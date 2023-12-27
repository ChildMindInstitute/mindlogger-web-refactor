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
  startAt: Date | null
  endAt: Date | null
}

type EventId = string
type EntityId = string
type AppletId = string

export type EventProgressState = ActivityOrFlowProgress & EventProgressTimestampState

export type EventsProgress = Record<EventId, EventProgressState>

export type EntitiesProgress = Record<EntityId, EventsProgress>

export type Progress = Record<AppletId, EntitiesProgress>

export type CompletedEntitiesState = Record<EntityId, number>

export type EventCompletions = Record<EventId, number[]>

export type CompletedEventEntities = Record<EntityId, EventCompletions>
