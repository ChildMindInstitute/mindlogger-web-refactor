import { EventEntity } from './activityGroups.types';
import { GroupUtility, GroupsBuildContext } from './GroupUtility';

import { IEvaluator } from '~/abstract/lib';
import { AvailabilityLabelType, PeriodicityType } from '~/entities/event';
import { DatesFromTo } from '~/shared/utils';

export class ScheduledGroupEvaluator implements IEvaluator<EventEntity> {
  private utility: GroupUtility;

  constructor(inputParams: GroupsBuildContext) {
    this.utility = new GroupUtility(inputParams);
  }

  public evaluate(eventsEntities: Array<EventEntity>): Array<EventEntity> {
    const notInProgress = eventsEntities.filter((x) => !this.utility.isInProgress(x));

    const result: Array<EventEntity> = [];

    const now = this.utility.getNow();

    for (const eventEntity of notInProgress) {
      const { event } = eventEntity;

      const isTypeScheduled =
        event.availability.availabilityType === AvailabilityLabelType.ScheduledAccess;

      const isAccessBeforeTimeFrom = event.availability.allowAccessBeforeFromTime;

      const isCompletedToday = this.utility.isCompletedToday(eventEntity);

      const isScheduledToday = this.utility.isToday(event.scheduledAt);

      const isSpreadToNextDay = this.utility.isSpreadToNextDay(event);

      if (!event.scheduledAt) {
        throw new Error('[ScheduledGroupdEvaluator:evaluate] Event scheduledAt is not defined');
      }

      const isCandidateForBeingScheduled: boolean =
        isTypeScheduled && isScheduledToday && now < event.scheduledAt && !isAccessBeforeTimeFrom;

      if (!isCandidateForBeingScheduled) {
        continue;
      }

      if (!isSpreadToNextDay) {
        if (!isCompletedToday) {
          result.push(eventEntity);
        }

        continue;
      }

      const periodicity = event.availability.periodicityType;

      const isMonday = now.getDay() === 1;

      const doSimpleSpreadCheck: boolean =
        periodicity === PeriodicityType.Weekly ||
        periodicity === PeriodicityType.Monthly ||
        periodicity === PeriodicityType.Once ||
        (periodicity === PeriodicityType.Weekdays && isMonday);

      if (doSimpleSpreadCheck) {
        if (!isCompletedToday) {
          result.push(eventEntity);
        }

        continue;
      }

      const isFromTueToFri = now.getDay() >= 2 && now.getDay() <= 5;

      const doAdvancedSpreadCheck =
        periodicity === PeriodicityType.Daily ||
        (periodicity === PeriodicityType.Weekdays && isFromTueToFri);

      const considerSpread = doAdvancedSpreadCheck;

      const voidInterval: DatesFromTo = this.utility.getVoidInterval(
        eventEntity.event,
        considerSpread,
      );

      const isInVoidInterval = this.utility.isInInterval(voidInterval, now, 'from');

      const isCompletedInVoidInterval = this.utility.isInInterval(
        voidInterval,
        this.utility.getCompletedAt(eventEntity),
        'from',
      );

      if (doAdvancedSpreadCheck && isInVoidInterval && !isCompletedInVoidInterval) {
        result.push(eventEntity);
      }
    }

    return result;
  }
}
