import { Activity, EventActivity } from "../../activity"

import { EventsByAppletIdResponseDTO, PeriodicityTypeDTO } from "~/shared/api"
import { AvailabilityType, PeriodicityType } from "~/shared/lib"
import { HourMinute } from "~/shared/utils"

class EventsBuilder {
  public convertToEventsGroupBuilder(events: EventsByAppletIdResponseDTO[], activities: Activity[]): EventActivity[] {
    const activitiesMap = new Map()

    activities.forEach(activity => {
      if (!activitiesMap.has(activity.id)) {
        activitiesMap.set(activity.id, activity)
      }
    })

    return events.map(event => {
      const isAlwaysAvailable = event.periodicity.type === "ALWAYS"
      const isTimerSet = event.timerType !== "NOT_SET"

      return {
        activity: activitiesMap.get(event.activityId),
        event: {
          id: event.id,
          activityId: event.activityId,
          scheduledAt: !isAlwaysAvailable ? this.convertToDate(event.periodicity.startDate) : null,
          timers: isTimerSet ? { timer: null, idleTimer: null } : null,
          selectedDate: null,
          availability: {
            oneTimeCompletion: event.oneTimeCompletion,
            allowAccessBeforeFromTime: event.accessBeforeSchedule,
            timeFrom: event.allDay ? this.convertToHourMinute(event.startTime) : null,
            timeTo: event.allDay ? this.convertToHourMinute(event.endTime) : null,
            startDate: !isAlwaysAvailable ? this.convertToDate(event.periodicity.startDate) : null,
            endDate: !isAlwaysAvailable ? this.convertToDate(event.periodicity.endDate) : null,
            availabilityType: isAlwaysAvailable ? AvailabilityType.AlwaysAvailable : AvailabilityType.ScheduledAccess,
            periodicityType: this.convertPeriodicitType(event.periodicity.type),
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
