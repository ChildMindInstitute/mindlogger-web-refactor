import { Activity, EventActivity } from "../../activity"
import { AvailabilityType, PeriodicityType } from "../lib"

import { EventsByAppletIdResponseDTO, PeriodicityTypeDTO } from "~/shared/api"
import { HourMinute } from "~/shared/utils"

class EventsBuilder {
  public convertToEventsGroupBuilder(
    eventDetails: EventsByAppletIdResponseDTO,
    activities: Activity[],
  ): EventActivity[] {
    const { events } = eventDetails
    const activitiesMap = new Map()

    activities.forEach(activity => {
      if (!activitiesMap.has(activity.id)) {
        activitiesMap.set(activity.id, activity)
      }
    })

    return events.map(event => {
      const isAlwaysAvailable = event.availabilityType === "AlwaysAvailable"

      return {
        activity: activitiesMap.get(event.entityId),
        event: {
          id: event.id,
          activityId: event.entityId,
          scheduledAt: !isAlwaysAvailable ? this.convertToDate(event.availability.startDate) : null,
          timers: event.timers,
          selectedDate: this.convertToDate(event.selectedDate),
          availability: {
            oneTimeCompletion: event.availability.oneTimeCompletion,
            allowAccessBeforeFromTime: event.availability.allowAccessBeforeFromTime,
            timeFrom: event.availability.timeFrom,
            timeTo: event.availability.timeTo,
            startDate: !isAlwaysAvailable ? this.convertToDate(event.availability.startDate) : null,
            endDate: !isAlwaysAvailable ? this.convertToDate(event.availability.endDate) : null,
            availabilityType: isAlwaysAvailable ? AvailabilityType.AlwaysAvailable : AvailabilityType.ScheduledAccess,
            periodicityType: this.convertPeriodicitType(event.availability.periodicityType),
          },
        },
      }
    })
  }

  private convertPeriodicitType(type: PeriodicityTypeDTO): PeriodicityType | null {
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
        return null
    }
  }

  private convertToHourMinute(time: string): HourMinute {
    const hourMinute = time.split(":")
    const hours = parseInt(hourMinute[0])
    const minutes = parseInt(hourMinute[1])

    return {
      hours,
      minutes,
    }
  }

  private convertToDate(date: string): Date {
    return new Date(date)
  }
}

export const eventsBuilder = new EventsBuilder()
