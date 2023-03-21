import { ActivityPipelineType } from "../lib"

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

export type ProgressState = Record<string, AppletProgressState>

// Payloads
export type UpsertActionPayload = {
  appletId: string
  activityId: string
  eventId: string
  progressPayload: EventProgressState
}
