import { AvailabilityLabelType } from "../../../event"

import { ActivityItemDetailsDTO } from "~/shared/api"
import { HourMinute } from "~/shared/utils"

export type ActivityListItem = {
  activityId: string
  flowId: string | null
  eventId: string

  name: string
  description: string
  image?: string | null

  entityAvailabilityType: AvailabilityLabelType
  isAlwaysAvailable: boolean

  status: ActivityStatus
  type: ActivityType

  isInActivityFlow: boolean

  activityFlowDetails?: {
    showActivityFlowBadge: boolean
    activityFlowName: string
    numberOfActivitiesInFlow: number
    activityPositionInFlow: number
  } | null

  availableFrom?: Date | null
  availableTo?: Date | null

  isTimerSet: boolean
  isTimerElapsed: boolean
  timeLeftToComplete?: HourMinute | null
}

export const enum ActivityStatus {
  NotDefined = 0,
  InProgress = 1,
  Scheduled = 2,
  Available = 3,
}

export const enum ActivityType {
  NotDefined = 0,
  Flanker = 1,
}

export type ActivityDetails = {
  id: string
  name: string
  description: string
  image: string | ""
  splashScreen: string | ""
  isSkippable: boolean
  isReviewable: boolean
  responseIsEditable: boolean
  order: number
  items: ActivityItemDetailsDTO[]
}

export type ActivityProgressPreview = {
  id: string
  title: string
  activityId: string
  eventId: string
}
