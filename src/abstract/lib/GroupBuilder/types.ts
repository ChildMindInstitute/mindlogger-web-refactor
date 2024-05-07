import { AvailabilityLabelType } from '~/entities/event';
import { HourMinute } from '~/shared/utils';

export type ActivityListItem = {
  activityId: string;
  flowId: string | null;
  eventId: string;

  name: string;
  description: string;
  image: string | null;

  entityAvailabilityType: AvailabilityLabelType;
  isAlwaysAvailable: boolean;

  status: ActivityStatus;
  type: ActivityType;

  isInActivityFlow: boolean;

  activityFlowDetails?: {
    showActivityFlowBadge: boolean;
    activityFlowName: string;
    numberOfActivitiesInFlow: number;
    activityPositionInFlow: number;
  } | null;

  availableFrom?: Date | null;
  availableTo?: Date | null;

  isTimerSet: boolean;
  isTimerElapsed: boolean;
  timeLeftToComplete?: HourMinute | null;
};

export type ActivityListGroup = {
  activities: Array<ActivityListItem>;
  name: string;
  type: ActivityGroupType;
};

export const enum ActivityGroupType {
  NotDefined = 0,
  InProgress = 1,
  Scheduled = 2,
  Available = 3,
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

export const ActivityGroupTypeNames = {
  [ActivityGroupType.NotDefined]: 'Not Defined',
  [ActivityGroupType.InProgress]: 'additional.in_progress',
  [ActivityGroupType.Scheduled]: 'additional.scheduled',
  [ActivityGroupType.Available]: 'additional.available',
};
