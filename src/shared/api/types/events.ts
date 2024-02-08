import { AllUserEventsDTO, AppletEventsResponse } from "./applet"
import { BaseSuccessResponse } from "./base"
import { HourMinute } from "../../utils"

export type TimerTypeDTO = "NOT_SET"
export type PeriodicityTypeDTO = "ONCE" | "DAILY" | "WEEKLY" | "WEEKDAYS" | "MONTHLY" | "ALWAYS"

export type GetEventsByAppletIdPayload = {
  appletId: string
}

export type GetEventsByPublicAppletKey = {
  publicAppletKey: string
}

export type SuccessEventsByAppletIdResponse = BaseSuccessResponse<AppletEventsResponse>
export type SuccessAllUserEventsResponse = BaseSuccessResponse<AllUserEventsDTO[]>

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
  selectedDate: string | null
  timers: {
    timer: HourMinute
    idleTimer: HourMinute
  }
  availabilityType: "AlwaysAvailable" | "ScheduledAccess"
}
