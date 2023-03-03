import { BaseSuccessListResponse } from "./base"

export type TimerTypeDTO = "NOT_SET"
export type PeriodicityTypeDTO = "ONCE" | "DAILY" | "WEEKLY" | "WEEKDAYS" | "MONTHLY" | "ALWAYS"

export type GetEventsByAppletIdPayload = {
  appletId: string
}

export type SuccessEventsByAppletIdResponse = BaseSuccessListResponse<EventsByAppletIdResponseDTO>

export type EventsByAppletIdResponseDTO = {
  startTime: string // Example: "09:00"
  endTime: string // Example: "21:00"
  allDay: boolean
  accessBeforeSchedule: boolean
  oneTimeCompletion: boolean
  timer: number
  timerType: TimerTypeDTO
  id: string
  periodicity: {
    type: PeriodicityTypeDTO
    startDate: string // Example: "2023-03-03"
    endDate: string // Example: "2023-03-03"
    interval: number
  }
  userId: string | null
  activityId: string
  flowId: string | null
}
