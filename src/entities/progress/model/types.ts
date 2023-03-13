import { InputType, PipelineType } from "~/shared/utils"

type ActivityFlowProgress = {
  type: PipelineType.Flow
  currentActivityId: string
}

type ActivityProgress = {
  type: PipelineType.Regular
}

type ActivityOrFlowProgress = ActivityFlowProgress | ActivityProgress

type ActivityItemType = InputType

export type ProgressPayloadAnswer = {
  itemId: string
  question: string
  responseType: ActivityItemType

  isSkippable: boolean
  isRandom: boolean
  isAbleToMoveToPrevious: boolean
  hasTextResponse: boolean
  ordering: number

  answer: string | null
}

export type EventProgressState = ActivityOrFlowProgress & {
  startAt: Date | null
  endAt: Date | null
  itemAnswers: ProgressPayloadAnswer[]
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
