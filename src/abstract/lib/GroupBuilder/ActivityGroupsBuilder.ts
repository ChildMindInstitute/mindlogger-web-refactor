import { EventEntity } from './activityGroups.types';
import { AvailableGroupEvaluator } from './AvailableGroupEvaluator';
import { GroupsBuildContext, GroupUtility } from './GroupUtility';
import { ListItemsFactory } from './ListItemsFactory';
import { ScheduledGroupEvaluator } from './ScheduledGroupEvaluator';
import {
  ActivityGroupType,
  ActivityGroupTypeNames,
  ActivityListGroup,
  ActivityListItem,
} from './types';

export interface IActivityGroupsBuilder {
  buildInProgress: (eventsActivities: Array<EventEntity>) => ActivityListGroup;
  buildAvailable: (eventsActivities: Array<EventEntity>) => ActivityListGroup;
  buildScheduled: (eventsActivities: Array<EventEntity>) => ActivityListGroup;
}

export class ActivityGroupsBuilder implements IActivityGroupsBuilder {
  private itemsFactory: ListItemsFactory;

  private scheduledEvaluator: ScheduledGroupEvaluator;

  private availableEvaluator: AvailableGroupEvaluator;

  private utility: GroupUtility;

  constructor(inputParams: GroupsBuildContext) {
    this.itemsFactory = new ListItemsFactory(inputParams);
    this.scheduledEvaluator = new ScheduledGroupEvaluator(inputParams);
    this.availableEvaluator = new AvailableGroupEvaluator(inputParams);
    this.utility = new GroupUtility(inputParams);
  }

  public buildInProgress(eventEntities: Array<EventEntity>): ActivityListGroup {
    const filtered = eventEntities.filter((x) => this.utility.isInProgress(x));

    const activityItems: Array<ActivityListItem> = [];

    for (const eventEntity of filtered) {
      const item = this.itemsFactory.createProgressItem(eventEntity);

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.InProgress],
      type: ActivityGroupType.InProgress,
    };

    return result;
  }

  public buildAvailable(eventEntities: Array<EventEntity>): ActivityListGroup {
    const filtered = this.availableEvaluator.evaluate(eventEntities);

    const activityItems: Array<ActivityListItem> = [];

    for (const eventEntity of filtered) {
      const item = this.itemsFactory.createAvailableItem(eventEntity);

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.Available],
      type: ActivityGroupType.Available,
    };

    return result;
  }

  public buildScheduled(eventEntities: Array<EventEntity>): ActivityListGroup {
    const filtered = this.scheduledEvaluator.evaluate(eventEntities);

    const activityItems: Array<ActivityListItem> = [];

    for (const eventEntity of filtered) {
      const item = this.itemsFactory.createScheduledItem(eventEntity);

      activityItems.push(item);
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.Scheduled],
      type: ActivityGroupType.Scheduled,
    };

    return result;
  }
}

export const createActivityGroupsBuilder = (
  inputData: GroupsBuildContext,
): ActivityGroupsBuilder => {
  return new ActivityGroupsBuilder(inputData);
};
