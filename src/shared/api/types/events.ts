import { HourMinute } from "../../utils"
import { BaseSuccessResponse } from "./base"

export type TimerTypeDTO = "NOT_SET"
export type PeriodicityTypeDTO = "ONCE" | "DAILY" | "WEEKLY" | "WEEKDAYS" | "MONTHLY" | "ALWAYS"

export type GetEventsByAppletIdPayload = {
  appletId: string
}

export type SuccessEventsByAppletIdResponse = BaseSuccessResponse<EventsByAppletIdResponseDTO>

export type EventsByAppletIdResponseDTO = {
  appletId: string
  events: EventDTO[]
}

export type EventDTO = {
  id: string
  entityId: string
  availability: {
    oneTimeCompletion: boolean
    periodicityType: "ONCE" | "DAILY" | "WEEKLY" | "WEEKDAYS" | "MONTHLY" | "ALWAYS"
    timeFrom: HourMinute
    timeTo: HourMinute
    allowAccessBeforeFromTime: boolean
    startDate: string
    endDate: string
  }
  selectedDate: string
  timers: {
    timer: HourMinute
    idleTimer: HourMinute
  }
  availabilityType: "AlwaysAvailable" | "ScheduledAccess"
}
