import { addDays, isEqual, startOfDay, subDays, subSeconds } from "date-fns"

import { EventEntity, Activity } from "../../lib"

import { EventProgressState, Progress } from "~/abstract/lib"
import { AvailabilityLabelType, PeriodicityType, ScheduleEvent } from "~/entities/event"
import {
  DatesFromTo,
  HourMinute,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
  getMsFromHours,
  getMsFromMinutes,
  isSourceLess,
} from "~/shared/utils"

export type GroupsBuildContext = {
  allAppletActivities: Activity[]
  progress: Progress
  appletId: string
}

export class GroupUtility {
  protected progress: Progress

  protected appletId: string

  protected _activities: Activity[]

  constructor(inputParams: GroupsBuildContext) {
    this.progress = inputParams.progress
    this._activities = inputParams.allAppletActivities
    this.appletId = inputParams.appletId
  }

  private getStartedAt(eventActivity: EventEntity): Date {
    const record = this.getProgressRecord(eventActivity)!

    return record.startAt!
  }

  private getAllowedTimeInterval(
    eventActivity: EventEntity,
    scheduledWhen: "today" | "yesterday",
    isAccessBeforeStartTime = false,
  ): DatesFromTo {
    const { event } = eventActivity

    const { hours: hoursFrom, minutes: minutesFrom } = event.availability.timeFrom!
    const { hours: hoursTo, minutes: minutesTo } = event.availability.timeTo!

    if (scheduledWhen === "today") {
      const allowedFrom = this.getToday()

      if (!isAccessBeforeStartTime) {
        allowedFrom.setHours(hoursFrom)
        allowedFrom.setMinutes(minutesFrom)
      }

      const allowedTo = this.getEndOfDay()

      return { from: allowedFrom, to: allowedTo }
    } else {
      const allowedFrom = this.getYesterday()

      if (!isAccessBeforeStartTime) {
        allowedFrom.setHours(hoursFrom)
        allowedFrom.setMinutes(minutesFrom)
      }

      const allowedTo = this.getToday()
      allowedTo.setHours(hoursTo)
      allowedTo.setMinutes(minutesTo)

      return { from: allowedFrom, to: allowedTo }
    }
  }

  public get activities(): Activity[] {
    return this._activities
  }

  public getNow = () => new Date()

  public getToday = () => startOfDay(this.getNow())

  public getYesterday = () => subDays(this.getToday(), 1)

  public getEndOfDay = () => subSeconds(addDays(this.getToday(), 1), 1)

  public getTomorrow = () => addDays(this.getToday(), 1)

  public isToday(date: Date | null | undefined): boolean {
    if (!date) {
      return false
    }
    return isEqual(this.getToday(), startOfDay(date))
  }

  public isYesterday(date: Date | null | undefined): boolean {
    if (!date) {
      return false
    }
    return isEqual(this.getYesterday(), startOfDay(date))
  }

  public getProgressRecord(eventActivity: EventEntity): EventProgressState | null {
    const record = this.progress[this.appletId]?.[eventActivity.entity.id]?.[eventActivity.event.id]
    return record ?? null
  }

  public getCompletedAt(eventActivity: EventEntity): Date | null {
    const progressRecord = this.getProgressRecord(eventActivity)

    return progressRecord?.endAt ?? null
  }

  public isInProgress(eventActivity: EventEntity): boolean {
    const record = this.getProgressRecord(eventActivity)
    if (!record) {
      return false
    }
    return !!record.startAt && !record.endAt
  }

  public isInTimeInterval(
    interval: DatesFromTo,
    valueToCheck: Date | null,
    including: "from" | "to" | "both" | "none",
  ): boolean {
    if (!valueToCheck) {
      return false
    }

    switch (including) {
      case "both":
        return interval.from <= valueToCheck && valueToCheck <= interval.to
      case "from":
        return interval.from <= valueToCheck && valueToCheck < interval.to
      case "to":
        return interval.from < valueToCheck && valueToCheck <= interval.to
      case "none":
        return interval.from < valueToCheck && valueToCheck < interval.to
    }
  }

  public getVoidTimeInterval(event: ScheduleEvent, considerSpread: boolean): DatesFromTo {
    const buildFrom = considerSpread && this.isSpreadToNextDay(event)

    const { timeFrom, timeTo } = event.availability

    let from = this.getToday()

    if (buildFrom) {
      from = this.getToday()
      from.setHours(timeTo!.hours)
      from.setMinutes(timeTo!.minutes)
    }

    const to = this.getToday()
    to.setHours(timeFrom!.hours)
    to.setMinutes(timeFrom!.minutes)

    return { from, to }
  }

  public isSpreadToNextDay(event: ScheduleEvent): boolean {
    return (
      event.availability.availabilityType === AvailabilityLabelType.ScheduledAccess &&
      isSourceLess({
        timeSource: event.availability.timeTo!,
        timeTarget: event.availability.timeFrom!,
      })
    )
  }

  public isCompletedInAllowedTimeInterval(
    eventActivity: EventEntity,
    scheduledWhen: "today" | "yesterday",
    isAccessBeforeStartTime = false,
  ): boolean {
    const { from: allowedFrom, to: allowedTo } = this.getAllowedTimeInterval(
      eventActivity,
      scheduledWhen,
      isAccessBeforeStartTime,
    )

    const completedAt = this.getCompletedAt(eventActivity)!

    if (!completedAt) {
      return false
    }

    if (scheduledWhen === "today") {
      return allowedFrom <= completedAt && completedAt <= allowedTo
    } else {
      return allowedFrom <= completedAt && completedAt < allowedTo
    }
  }

  public isScheduledYesterday(event: ScheduleEvent): boolean {
    if (event.availability.availabilityType === AvailabilityLabelType.AlwaysAvailable) {
      return true
    }

    const periodicity = event.availability.periodicityType

    if (periodicity === PeriodicityType.Daily) {
      return true
    }

    if (periodicity === PeriodicityType.Weekdays) {
      const currentDay = this.getNow().getDay()

      return currentDay >= 2 && currentDay <= 6
    }

    if (
      periodicity === PeriodicityType.Once ||
      periodicity === PeriodicityType.Weekly ||
      periodicity === PeriodicityType.Monthly
    ) {
      return this.isYesterday(event.scheduledAt)
    }

    return false
  }

  public isCompletedToday(eventActivity: EventEntity): boolean {
    const date = this.getCompletedAt(eventActivity)

    return !!date && this.isToday(date)
  }

  public isInAllowedTimeInterval(
    eventActivity: EventEntity,
    scheduledWhen: "today" | "yesterday",
    isAccessBeforeStartTime = false,
  ): boolean {
    const { from: allowedFrom, to: allowedTo } = this.getAllowedTimeInterval(
      eventActivity,
      scheduledWhen,
      isAccessBeforeStartTime,
    )

    const now = this.getNow()

    if (scheduledWhen === "today") {
      return allowedFrom <= now && now <= allowedTo
    } else {
      return allowedFrom <= now && now < allowedTo
    }
  }

  public getTimeToComplete(eventActivity: EventEntity): HourMinute | null {
    const { event } = eventActivity
    const timer = event.timers.timer!

    const startedTime = this.getStartedAt(eventActivity)

    const activityDuration: number = getMsFromHours(timer.hours) + getMsFromMinutes(timer.minutes)

    const alreadyElapsed: number = this.getNow().getTime() - startedTime.getTime()

    if (alreadyElapsed < activityDuration) {
      const left: number = activityDuration - alreadyElapsed

      const hours = Math.floor(left / MS_IN_MINUTE / MINUTES_IN_HOUR)
      const minutes = Math.floor((left - getMsFromHours(hours)) / MS_IN_MINUTE)

      return { hours, minutes }
    } else {
      return null
    }
  }
}