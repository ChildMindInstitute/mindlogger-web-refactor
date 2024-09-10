import { Activity, ActivityFlow, EventEntity } from './activityGroups.types';
import { GroupUtility, GroupsBuildContext } from './GroupUtility';
import { ActivityListItem, ActivityStatus, ActivityType } from './types';

import { ActivityPipelineType, FlowProgress } from '~/abstract/lib';
import { AvailabilityLabelType } from '~/entities/event';
import { MIDNIGHT_DATE } from '~/shared/constants';

export class ListItemsFactory {
  private utility: GroupUtility;

  constructor(inputParams: GroupsBuildContext) {
    this.utility = new GroupUtility(inputParams);
  }

  private populateActivityFlowFields(item: ActivityListItem, activityEvent: EventEntity) {
    const activityFlow = activityEvent.entity as ActivityFlow;

    item.isInActivityFlow = true;
    item.activityFlowDetails = {
      showActivityFlowBadge: !activityFlow.hideBadge,
      activityFlowName: activityFlow.name,
      numberOfActivitiesInFlow: activityFlow.activityIds.length,
      activityPositionInFlow: 0,
    };

    const isInProgress = this.utility.isInProgress(activityEvent);

    let activity: Activity | undefined, position: number;

    if (isInProgress) {
      const progressRecord = this.utility.getProgressRecord(activityEvent) as FlowProgress;

      activity = this.utility.activities.find((x) => x.id === progressRecord.currentActivityId);
      position = progressRecord.pipelineActivityOrder + 1;
    } else {
      activity = this.utility.activities.find((x) => x.id === activityFlow.activityIds[0]);
      position = 1;
    }

    if (!activity) {
      throw new Error(
        '[ListItemsFactory:populateActivityFlowFields] Activity not found in activities list',
      );
    }

    item.activityId = activity.id;
    item.activityFlowDetails.activityPositionInFlow = position;
    item.name = activity.name;
    item.description = activity.description;
    item.type = activity.type;
    item.image = activity.image;
  }

  private createListItem(eventEntity: EventEntity) {
    const { entity, event, targetSubject } = eventEntity;
    const { pipelineType } = eventEntity.entity;
    const isFlow = pipelineType === ActivityPipelineType.Flow;

    const item: ActivityListItem = {
      activityId: isFlow ? '' : entity.id,
      flowId: isFlow ? entity.id : null,
      eventId: event.id,
      targetSubject,
      name: isFlow ? '' : entity.name,
      description: isFlow ? '' : entity.description,
      type: isFlow ? ActivityType.NotDefined : (entity as Activity).type,
      entityAvailabilityType: event.availability.availabilityType,
      isAlwaysAvailable:
        event.availability.availabilityType === AvailabilityLabelType.AlwaysAvailable,
      image: isFlow ? null : entity.image,
      status: ActivityStatus.NotDefined,
      isTimerSet: false,
      isTimerElapsed: false,
      timeLeftToComplete: null,
      isInActivityFlow: false,
    };

    if (isFlow) {
      this.populateActivityFlowFields(item, eventEntity);
    }
    return item;
  }

  public createAvailableItem(eventEntity: EventEntity): ActivityListItem {
    const item = this.createListItem(eventEntity);

    item.status = ActivityStatus.Available;

    const { event } = eventEntity;

    if (event.availability.availabilityType === AvailabilityLabelType.ScheduledAccess) {
      const isSpread = this.utility.isSpreadToNextDay(event);

      const to = isSpread ? this.utility.getTomorrow() : this.utility.getToday();

      if (!event.availability.timeTo) {
        throw new Error(
          '[ListItemsFactory:createAvailableItem] Event availability timeTo is not defined',
        );
      }

      to.setHours(event.availability.timeTo.hours);
      to.setMinutes(event.availability.timeTo.minutes);
      item.availableTo = to;
    } else {
      item.availableTo = MIDNIGHT_DATE;
    }

    const timeLeftToComplete = event.timers?.timer;
    item.isTimerSet = !!timeLeftToComplete;

    if (item.isTimerSet) {
      item.timeLeftToComplete = timeLeftToComplete;
    }

    return item;
  }

  public createScheduledItem(eventEntity: EventEntity): ActivityListItem {
    const item = this.createListItem(eventEntity);

    item.status = ActivityStatus.Scheduled;

    const { event } = eventEntity;

    const from = this.utility.getNow();

    if (!event.availability.timeFrom) {
      throw new Error(
        '[ListItemsFactory:createScheduledItem] Event availability timeTo is not defined',
      );
    }

    from.setHours(event.availability.timeFrom.hours);
    from.setMinutes(event.availability.timeFrom.minutes);

    const isSpread = this.utility.isSpreadToNextDay(event);

    const to = isSpread ? this.utility.getTomorrow() : this.utility.getToday();

    if (!event.availability.timeTo) {
      throw new Error(
        '[ListItemsFactory:createScheduledItem] Event availability timeTo is not defined',
      );
    }

    to.setHours(event.availability.timeTo.hours);
    to.setMinutes(event.availability.timeTo.minutes);

    item.availableFrom = from;
    item.availableTo = to;

    return item;
  }

  public createProgressItem(eventEntity: EventEntity): ActivityListItem {
    const item = this.createListItem(eventEntity);

    item.status = ActivityStatus.InProgress;

    const { event } = eventEntity;

    if (event.availability.availabilityType === AvailabilityLabelType.ScheduledAccess) {
      const isSpread = this.utility.isSpreadToNextDay(event);

      const to = isSpread ? this.utility.getTomorrow() : this.utility.getToday();

      if (!event.availability.timeTo) {
        throw new Error(
          '[ListItemsFactory:createProgressItem] Event availability timeTo is not defined',
        );
      }

      to.setHours(event.availability.timeTo.hours);
      to.setMinutes(event.availability.timeTo.minutes);
      item.availableTo = to;
    } else {
      item.availableTo = MIDNIGHT_DATE;
    }

    item.isTimerSet = !!event.timers?.timer;

    if (item.isTimerSet) {
      const timeLeft = this.utility.getTimeToComplete(eventEntity);
      item.timeLeftToComplete = timeLeft;

      if (timeLeft === null) {
        item.isTimerElapsed = true;
      }
    }

    return item;
  }
}
