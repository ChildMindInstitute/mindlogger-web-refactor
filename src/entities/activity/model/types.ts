import { ActivityItemType } from "../../item"

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

export type ProgressPayloadState = {
  appletId: string
  activityId: string
  eventId: string
  startAt: Date | null
  endAt: Date | null
  answers: ProgressPayloadAnswer[]
}

export type ActivityProgressState = Array<ProgressPayloadState>
