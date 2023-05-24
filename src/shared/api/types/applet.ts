import { HourMinute } from "../../utils"
import { BaseSuccessListResponse, BaseSuccessResponse } from "./base"
import { PeriodicityTypeDTO } from "./events"

// API payloads
export type GetAppletByIdPayload = {
  appletId: string
}

export type GetPublicAppletByIdPayload = {
  publicAppletKey: string
}

export type GetPublicAppletActivityByIdPayload = {
  publicAppletKey: string
  activityId: string
}

// API Responses
export type AppletListSuccessResponse = BaseSuccessListResponse<AppletListDTO>
export type AppletSuccessResponse = BaseSuccessResponse<AppletDetailsDTO>

export type AppletListDTO = {
  id: string
  displayName: string
  version: string
  description: string
  about: string
  image: string | ""
  watermark: string | ""
}

export type AppletDetailsDTO = {
  id: string
  displayName: string
  version: string
  description: string
  about: string
  image: string | ""
  watermark: string | ""
  activities: AppletDetailsActivityDTO[]
  activityFlows: ActivityFlowDTO[]
}

export type AppletDetailsActivityDTO = {
  id: string
  name: string
  description: string
  splashScreen: string | ""
  image: string | ""
  showAllAtOnce: boolean
  isSkippable: boolean
  isReviewable: boolean
  isHidden: boolean
  responseIsEditable: boolean
  order: number
}

export type ActivityFlowDTO = {
  id: string
  name: string
  description: string
  image: string | ""
  isSingleReport: boolean
  hideBadge: boolean
  order: number
  isHidden: boolean
  activityIds: Array<string>
}

export type EventAvailabilityDto = {
  oneTimeCompletion: boolean
  periodicityType: PeriodicityTypeDTO
  timeFrom: HourMinute | null
  timeTo: HourMinute | null
  allowAccessBeforeFromTime: boolean
  startDate?: string | null
  endDate?: string | null
}

export type ScheduleEventDto = {
  id: string
  entityId: string
  availabilityType: string
  availability: EventAvailabilityDto
  selectedDate?: string | null
  timers: {
    timer: HourMinute | null
    idleTimer: HourMinute | null
  }
}

export type AppletEventsResponse = {
  events: ScheduleEventDto[]
}
