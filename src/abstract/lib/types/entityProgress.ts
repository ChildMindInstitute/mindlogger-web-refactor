import { AnswerAlert, ScoreRecord } from '~/features/PassSurvey/lib';
import { ScheduleEventDto } from '~/shared/api';

export type Consents = {
  shareToPublic: boolean;
  shareMediaToPublic: boolean;
};

export type AppletId = string;

export type ActivityConsents = Record<AppletId, Consents | undefined>;

export const enum ActivityPipelineType {
  NotDefined = 0,
  Regular,
  Flow,
}

type ActivityId = string;

export type ActivityScore = {
  activityName: string;
  scores: ScoreRecord[];
};

export type FlowSummaryData = {
  alerts: Array<AnswerAlert>;
  scores: ActivityScore;
  order: number;
};

export type FlowProgress = {
  type: ActivityPipelineType.Flow;
  currentActivityId: string;
  pipelineActivityOrder: number;
  currentActivityStartAt: number | null;
  executionGroupKey: string;
};

export type ActivityProgress = {
  type: ActivityPipelineType.Regular;
};

export type ProgressContext = {
  summaryData: Record<ActivityId, FlowSummaryData>;
};

export type ActivityOrFlowProgress = {
  context: ProgressContext;
  event: ScheduleEventDto | null;
} & (FlowProgress | ActivityProgress);

export type EventProgressTimestampState = {
  startAt: number | null;
  endAt: number | null;
};

export type GroupProgress = ActivityOrFlowProgress & EventProgressTimestampState;

/**
 * Combination of:
 * - entityId (= activityId/flowId),
 * - eventId
 * - targetSubjectId (optional; only if not self-report)
 */
export type GroupProgressId = `${string}/${string}` | `${string}/${string}/${string}`;

export type GroupProgressState = Record<GroupProgressId, GroupProgress>;
