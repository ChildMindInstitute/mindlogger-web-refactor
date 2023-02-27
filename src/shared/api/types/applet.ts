import { HourMinute } from "../../utils"
import { ActivityBaseDTO } from "./activity"
import { BaseSuccessListResponse, BaseSuccessResponse } from "./base"

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
export type AppletListSuccessResponse = BaseSuccessListResponse<AppletBaseDTO>
export type AppletSuccessResponse = BaseSuccessResponse<AppletDetailsDTO>

export type AppletBaseDTO = {
  id: string
  displayName: string
  version: string
  description: string
  about: string
  image?: string
  watermark?: string
  themeId: string
  reportServerIp: string
  reportPublicKey: string
  reportRecipients: Array<string>
  reportIncludeUserId: boolean
  reportIncludeCaseId: boolean
  reportEmailBody: string
  createdAt: Date
  updatedAt: Date
}

export type AppletDetailsDTO = AppletBaseDTO & {
  activities: ActivityBaseDTO[]
  activityFlows: ActivityFlowDTO[]
}

export type ActivityFlowDTO = {
  id: string
  guid: string
  name: string
  description: string
  isSingleReport: boolean
  hideBadge: boolean
  ordering: number
  activityIds: Array<string>
}

export type EventAvailabilityDto = {
  availabilityType: number
  oneTimeCompletion: boolean
  periodicityType: number
  timeFrom: HourMinute | null
  timeTo: HourMinute | null
  allowAccessBeforeFromTime: boolean
  startDate?: string | null
  endDate?: string | null
  selectedDate?: string | null
}

export type ScheduleEventDto = {
  entityId: string
  availability: EventAvailabilityDto
}
