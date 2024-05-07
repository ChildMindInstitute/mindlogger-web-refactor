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

export type ActivityOrFlowProgress = FlowProgress | ActivityProgress;

type EventProgressTimestampState = {
  startAt: number | null;
  endAt: number | null;
};

export type GroupProgress = ActivityOrFlowProgress & EventProgressTimestampState;

type GroupProgressId = string; // Group progress id is a combination of activityId and eventId (activityId/eventId)

export type GroupProgressState = Record<GroupProgressId, GroupProgress>;
