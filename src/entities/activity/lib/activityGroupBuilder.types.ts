import { ActivityType, ScheduleEvent } from "~/shared/lib"
import { PipelineType } from "~/shared/utils"

export type Entity = {
  id: string
  name: string
  description: string
  image: string | null
}

export type Activity = Entity & {
  type: ActivityType
  pipelineType: PipelineType.Regular
}

export type ActivityFlow = Entity & {
  hideBadge: boolean
  items: Array<{ activityId: string }>
  pipelineType: PipelineType.Flow
}

export type ActivityOrFlow = Activity | ActivityFlow

export type EventActivity = {
  activity: ActivityOrFlow
  event: ScheduleEvent
}

export type ActivityFlowProgress = {
  type: PipelineType.Flow
  currentActivityId: string
}

export type ActivityProgress = {
  type: PipelineType.Regular
}

export type ActivityOrFlowProgress = ActivityFlowProgress | ActivityProgress

export type ProgressPayload = ActivityOrFlowProgress & {
  startAt: Date | null
  endAt: Date | null
}

export type EntityProgress = {
  [appletId in string]: {
    [entityId in string]: {
      [eventId in string]: ProgressPayload | null
    }
  }
}
