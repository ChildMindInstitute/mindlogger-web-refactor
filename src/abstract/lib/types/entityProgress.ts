import { AnswerAlert, ScoreRecord } from '~/features/PassSurvey/lib';

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
  context: ProgressContext;
};

export type ActivityProgress = {
  type: ActivityPipelineType.Regular;
  context: ProgressContext;
};

export type ProgressContext = {
  summaryData: Record<ActivityId, FlowSummaryData>;
};

export type ActivityOrFlowProgress = FlowProgress | ActivityProgress;

type EventProgressTimestampState = {
  startAt: number | null;
  endAt: number | null;
};

export type GroupProgress = ActivityOrFlowProgress & EventProgressTimestampState;

type GroupProgressId = string; // Group progress id is a combination of entityId and eventId (EntityId = ActivityId or FlowId)

export type GroupProgressState = Record<GroupProgressId, GroupProgress>;
