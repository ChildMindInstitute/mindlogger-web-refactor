import { ScheduleEvent, PeriodicityType, AvailabilityLabelType } from "../lib"

import { buildDateFromDto } from "~/abstract/lib"
import { PeriodicityTypeDTO, ScheduleEventDto } from "~/shared/api"

export function mapEventsFromDto(eventsDto: ScheduleEventDto[]): ScheduleEvent[] {
  return eventsDto.map<ScheduleEvent>(x => mapEventFromDto(x))
}
export function mapEventFromDto(dto: ScheduleEventDto): ScheduleEvent {
  return {
    id: dto.id,
    entityId: dto.entityId,
    selectedDate: buildDateFromDto(dto.selectedDate),
    timers: {
      idleTimer: dto.timers.idleTimer,
      timer: dto.timers.timer,
    },
    scheduledAt: null,
    availability: {
      allowAccessBeforeFromTime: dto.availability.allowAccessBeforeFromTime,
      availabilityType: dto.availabilityType as unknown as AvailabilityLabelType, // TODO: change to mapper
      periodicityType: convertPeriodicitType(dto.availability.periodicityType),
      startDate: buildDateFromDto(dto.availability.startDate),
      endDate: buildDateFromDto(dto.availability.endDate),
      oneTimeCompletion: dto.availability.oneTimeCompletion,
      timeFrom: dto.availability.timeFrom,
      timeTo: dto.availability.timeTo,
    },
    notificationSettings: {
      notifications: [],
      reminder: null,
    },
  }
}

export function convertPeriodicitType(type: PeriodicityTypeDTO): PeriodicityType {
  switch (type) {
    case "ONCE":
      return PeriodicityType.Once
    case "DAILY":
      return PeriodicityType.Daily
    case "WEEKLY":
      return PeriodicityType.Weekly
    case "WEEKDAYS":
      return PeriodicityType.Weekdays
    case "MONTHLY":
      return PeriodicityType.Monthly
    default:
      return PeriodicityType.Once
  }
}
