import { addDays, addYears, isEqual, startOfDay, subDays, subSeconds, subYears } from 'date-fns';

import { Activity, EventEntity } from './activityGroups.types';

import { GroupProgress, GroupProgressState, getProgressId } from '~/abstract/lib';
import { AvailabilityLabelType, PeriodicityType, ScheduleEvent } from '~/entities/event';
import { MINUTES_IN_HOUR, MS_IN_MINUTE } from '~/shared/constants';
import {
  DatesFromTo,
  HourMinute,
  getMsFromHours,
  getMsFromMinutes,
  isSourceLess,
} from '~/shared/utils';

const ManyYears = 100;

export type GroupsBuildContext = {
  allAppletActivities: Activity[];
  progress: GroupProgressState;
};

export class GroupUtility {
  protected progress: GroupProgressState;

  protected _activities: Activity[];

  constructor(inputParams: GroupsBuildContext) {
    this.progress = inputParams.progress;
    this._activities = inputParams.allAppletActivities;
  }

  private getStartedAt(eventActivity: EventEntity): Date {
    const record = this.getProgressRecord(eventActivity);

    if (record === null) {
      throw new Error('[getStartedAt] Progress record is null');
    }

    if (record.startAt === null) {
      throw new Error('[getStartedAt] Progress record startAt is null');
    }

    return new Date(record.startAt);
  }

  private getAllowedTimeInterval(
    eventEntity: EventEntity,
    scheduledWhen: 'today' | 'yesterday',
    isAccessBeforeStartTime = false,
  ): DatesFromTo {
    const { event } = eventEntity;

    if (event.availability.timeFrom === null) {
      throw new Error('[getAllowedTimeInterval] timeFrom is null');
    }

    if (event.availability.timeTo === null) {
      throw new Error('[getAllowedTimeInterval] timeTo is null');
    }

    const { hours: hoursFrom, minutes: minutesFrom } = event.availability.timeFrom;
    const { hours: hoursTo, minutes: minutesTo } = event.availability.timeTo;

    if (scheduledWhen === 'today') {
      const allowedFrom = this.getToday();

      if (!isAccessBeforeStartTime) {
        allowedFrom.setHours(hoursFrom);
        allowedFrom.setMinutes(minutesFrom);
      }

      const allowedTo = this.getEndOfDay();

      return { from: allowedFrom, to: allowedTo };
    } else {
      const allowedFrom = this.getYesterday();

      if (!isAccessBeforeStartTime) {
        allowedFrom.setHours(hoursFrom);
        allowedFrom.setMinutes(minutesFrom);
      }

      const allowedTo = this.getToday();
      allowedTo.setHours(hoursTo);
      allowedTo.setMinutes(minutesTo);

      return { from: allowedFrom, to: allowedTo };
    }
  }

  public get activities(): Activity[] {
    return this._activities;
  }

  public getNow = () => new Date();

  public getToday = () => startOfDay(this.getNow());

  public getYesterday = () => subDays(this.getToday(), 1);

  public getEndOfDay = (date: Date = this.getToday()) => subSeconds(addDays(date, 1), 1);

  public getTomorrow = () => addDays(this.getToday(), 1);

  public isToday(date: Date | null | undefined): boolean {
    if (!date) {
      return false;
    }
    return isEqual(this.getToday(), startOfDay(date));
  }

  public isYesterday(date: Date | null | undefined): boolean {
    if (!date) {
      return false;
    }
    return isEqual(this.getYesterday(), startOfDay(date));
  }

  public getProgressRecord(eventEntity: EventEntity): GroupProgress | null {
    const record =
      this.progress[
        getProgressId(eventEntity.entity.id, eventEntity.event.id, eventEntity.targetSubject?.id)
      ];
    return record ?? null;
  }

  public getCompletedAt(eventEntity: EventEntity): Date | null {
    const progressRecord = this.getProgressRecord(eventEntity);

    return progressRecord?.endAt ? new Date(progressRecord.endAt) : null;
  }

  public isInProgress(eventEntity: EventEntity): boolean {
    const record = this.getProgressRecord(eventEntity);
    if (!record) {
      return false;
    }
    return !!record.startAt && !record.endAt;
  }

  public isInInterval(
    interval: Partial<DatesFromTo>,
    valueToCheck: Date | null,
    including: 'from' | 'to' | 'both' | 'none',
  ): boolean {
    if (!valueToCheck) {
      return false;
    }

    const deepPast = subYears(this.getToday(), ManyYears);
    const deepFuture = addYears(this.getToday(), ManyYears);

    const from = interval.from ?? deepPast;
    const to = interval.to ?? deepFuture;

    switch (including) {
      case 'both':
        return from <= valueToCheck && valueToCheck <= to;
      case 'from':
        return from <= valueToCheck && valueToCheck < to;
      case 'to':
        return from < valueToCheck && valueToCheck <= to;
      case 'none':
        return from < valueToCheck && valueToCheck < to;
    }
  }

  public getVoidInterval(event: ScheduleEvent, considerSpread: boolean): DatesFromTo {
    const buildFrom = considerSpread && this.isSpreadToNextDay(event);

    const { timeFrom, timeTo } = event.availability;

    let from = this.getToday();

    if (timeFrom === null) {
      throw new Error('[getVoidInterval] timeFrom is null');
    }

    if (timeTo === null) {
      throw new Error('[getVoidInterval] timeTo is null');
    }

    if (buildFrom) {
      from = this.getToday();
      from.setHours(timeTo.hours);
      from.setMinutes(timeTo.minutes);
    }

    const to = this.getToday();
    to.setHours(timeFrom.hours);
    to.setMinutes(timeFrom.minutes);

    return { from, to };
  }

  public isSpreadToNextDay(event: ScheduleEvent): boolean {
    if (event.availability.timeFrom === null) {
      throw new Error('[isSpreadToNextDay] timeFrom is null');
    }

    if (event.availability.timeTo === null) {
      throw new Error('[isSpreadToNextDay] timeTo is null');
    }

    return (
      event.availability.availabilityType === AvailabilityLabelType.ScheduledAccess &&
      isSourceLess({
        timeSource: event.availability.timeTo,
        timeTarget: event.availability.timeFrom,
      })
    );
  }

  public isCompletedInAllowedTimeInterval(
    eventEntity: EventEntity,
    scheduledWhen: 'today' | 'yesterday',
    isAccessBeforeStartTime = false,
  ): boolean {
    const { from: allowedFrom, to: allowedTo } = this.getAllowedTimeInterval(
      eventEntity,
      scheduledWhen,
      isAccessBeforeStartTime,
    );

    const completedAt = this.getCompletedAt(eventEntity);

    if (!completedAt) {
      return false;
    }

    if (scheduledWhen === 'today') {
      return allowedFrom <= completedAt && completedAt <= allowedTo;
    } else {
      return allowedFrom <= completedAt && completedAt < allowedTo;
    }
  }

  public isInsideValidDatesInterval(event: ScheduleEvent) {
    const { startDate, endDate } = event.availability;

    const now = this.getNow();

    return this.isInInterval(
      {
        from: startDate ?? undefined,
        to: endDate ?? undefined,
      },
      now,
      'both',
    );
  }

  public isScheduledYesterday(event: ScheduleEvent): boolean {
    if (event.availability.availabilityType === AvailabilityLabelType.AlwaysAvailable) {
      return true;
    }

    const periodicity = event.availability.periodicityType;

    if (periodicity === PeriodicityType.Daily) {
      return true;
    }

    if (periodicity === PeriodicityType.Weekdays) {
      const currentDay = this.getNow().getDay();

      return currentDay >= 2 && currentDay <= 6;
    }

    if (
      periodicity === PeriodicityType.Once ||
      periodicity === PeriodicityType.Weekly ||
      periodicity === PeriodicityType.Monthly
    ) {
      return this.isYesterday(event.scheduledAt);
    }

    return false;
  }

  public isCompletedToday(eventEntity: EventEntity): boolean {
    const date = this.getCompletedAt(eventEntity);

    return !!date && this.isToday(date);
  }

  public isInAllowedTimeInterval(
    eventEntity: EventEntity,
    scheduledWhen: 'today' | 'yesterday',
    isAccessBeforeStartTime = false,
  ): boolean {
    const { from: allowedFrom, to: allowedTo } = this.getAllowedTimeInterval(
      eventEntity,
      scheduledWhen,
      isAccessBeforeStartTime,
    );

    const now = this.getNow();

    if (scheduledWhen === 'today') {
      return allowedFrom <= now && now <= allowedTo;
    } else {
      return allowedFrom <= now && now < allowedTo;
    }
  }

  public getTimeToComplete(eventEntity: EventEntity): HourMinute | null {
    const { event } = eventEntity;
    const timer = event.timers.timer;

    if (timer === null) {
      throw new Error('[getTimeToComplete] Timer is null');
    }

    const startedTime = this.getStartedAt(eventEntity);

    const activityDuration: number = getMsFromHours(timer.hours) + getMsFromMinutes(timer.minutes);

    const alreadyElapsed: number = this.getNow().getTime() - startedTime.getTime();

    if (alreadyElapsed < activityDuration) {
      const left: number = activityDuration - alreadyElapsed;

      const hours = Math.floor(left / MS_IN_MINUTE / MINUTES_IN_HOUR);
      const minutes = Math.floor((left - getMsFromHours(hours)) / MS_IN_MINUTE);

      return { hours, minutes };
    } else {
      return null;
    }
  }
}
