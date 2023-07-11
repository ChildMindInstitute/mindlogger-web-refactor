import { ActivityType } from "~/entities/activity"
import { ScheduleEvent } from "~/entities/event"

export const enum ActivityPipelineType {
  NotDefined = 0,
  Regular,
  Flow,
}

export type EntityBase = {
  id: string
  name: string
  description: string
  image?: string | null
  isHidden: boolean
  order: number
}

export type Activity = EntityBase & {
  type: ActivityType
  pipelineType: ActivityPipelineType.Regular
}

export type ActivityFlow = EntityBase & {
  hideBadge: boolean
  activityIds: Array<string>
  pipelineType: ActivityPipelineType.Flow
}

export type Entity = Activity | ActivityFlow

export type EventActivity = {
  entity: Entity
  event: ScheduleEvent
}

export type ActivityFlowProgress = {
  type: ActivityPipelineType.Flow
  currentActivityId: string
  pipelineActivityOrder: number
}

export type ActivityProgress = {
  type: ActivityPipelineType.Regular
}

export type ActivityOrFlowProgress = ActivityFlowProgress | ActivityProgress

export type ProgressPayload = ActivityOrFlowProgress & {
  startAt: string | null
  endAt: string | null
}

export type EntityProgress = {
  [appletId in string]: {
    [entityId in string]: {
      [eventId in string]: ProgressPayload | null
    }
  }
}
