import { ActivityItemType } from "../../item"
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

export type GroupsProgressState = Record<string, AppletProgressState>

export type ActivityEventProgressRecord = {
  id: string
  question: string
  type: ActivityItemType
  answer: string[]
  config: {
    isSkippable: boolean
    isRandom: boolean
    isAbleToMoveToPrevious: boolean
    hasTextResponse: boolean
    ordering: number
  }
}

export type ActivityEventProgressState = Record<string, ActivityEventProgressRecord[]>

// Payloads
export type UpsertActionPayload = {
  appletId: string
  activityId: string
  eventId: string
  progressPayload: EventProgressState
}
