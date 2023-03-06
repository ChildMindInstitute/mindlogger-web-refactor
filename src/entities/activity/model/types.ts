export type ProgressPayloadState = {
  appletId: string
  activityId: string
  eventId: string
  startAt: Date | null
  endAt: Date | null
}

export type ActivityProgressState = Array<ProgressPayloadState>
