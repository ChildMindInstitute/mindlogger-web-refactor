import { ActivityPipelineType } from '~/abstract/lib';
import { ActivityType } from '~/abstract/lib/GroupBuilder';
import { ScheduleEvent } from '~/entities/event';
import { SubjectDTO } from '~/shared/api/types/subject';

export type EntityBase = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  isHidden: boolean;
  order: number;
  autoAssign: boolean;
};

export type Activity = EntityBase & {
  type: ActivityType;
  pipelineType: ActivityPipelineType.Regular;
};

export type ActivityFlow = EntityBase & {
  hideBadge: boolean;
  activityIds: Array<string>;
  pipelineType: ActivityPipelineType.Flow;
};

export type Entity = Activity | ActivityFlow;

export type EventEntity = {
  entity: Entity;
  event: ScheduleEvent;
  /** Target subject of assignment if not self-report, else null */
  targetSubject: SubjectDTO | null;
};

export type EntityType = 'regular' | 'flow';
