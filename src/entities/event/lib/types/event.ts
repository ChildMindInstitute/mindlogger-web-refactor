import { NotificationTriggerType } from "~/abstract/lib"
import { HourMinute } from "~/shared/utils"

export const enum AvailabilityType {
  NotDefined = 0,
  AlwaysAvailable = 1,
  ScheduledAccess = 2,
}

export const enum AvailabilityLabelType {
  NotDefined = "NotDefined",
  AlwaysAvailable = "AlwaysAvailable",
  ScheduledAccess = "ScheduledAccess",
}

export const enum PeriodicityType {
  NotDefined = "NotDefined",
  Always = "ALWAYS",
  Once = "ONCE",
  Daily = "DAILY",
  Weekly = "WEEKLY",
  Weekdays = "WEEKDAYS",
  Monthly = "MONTHLY",
}

export type EventAvailability = {
  availabilityType: AvailabilityLabelType
  oneTimeCompletion: boolean
  periodicityType: PeriodicityType
  timeFrom: HourMinute | null
  timeTo: HourMinute | null
  allowAccessBeforeFromTime: boolean
  startDate: Date | null
  endDate: Date | null
}

export type EventNotification = {
  triggerType: NotificationTriggerType
  From?: HourMinute | null
  To?: HourMinute | null
  At?: HourMinute | null
}

type NotificationSettings = {
  notifications: EventNotification[]
  reminder?: null | { activityIncomplete: number; reminderTime: HourMinute }
}

export type ScheduleEvent = {
  id: string
  entityId: string
  availability: EventAvailability
  timers: {
    timer: HourMinute | null
    idleTimer: HourMinute | null
  }
  notificationSettings: NotificationSettings
  selectedDate: Date | null
  scheduledAt: Date | null
}
