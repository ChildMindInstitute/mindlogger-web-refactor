import { describe, expect, it } from 'vitest';

import { actions, reducer } from './slice';

import { ActivityPipelineType, FlowProgress, GroupProgress, getProgressId } from '~/abstract/lib';

const flowId = 'flow-1';
const eventId = 'event-1';
const activityId = 'activity-1';
const firstActivityId = 'activity-first';
const targetSubjectId = null;

const progressId = getProgressId(flowId, eventId, targetSubjectId);

function stateWithFlowProgress(overrides: Partial<GroupProgress> = {}) {
  const progress: FlowProgress = {
    type: ActivityPipelineType.Flow,
    currentActivityId: activityId,
    pipelineActivityOrder: 2,
    submitId: 'old-submit-id',
  };
  return {
    groupProgress: {
      [progressId]: {
        ...progress,
        startAt: 1000,
        endAt: null,
        context: { summaryData: {} },
        event: null,
        ...overrides,
      } as GroupProgress,
    },
    progress: {},
    completedEntities: {},
    completions: {},
    multiInformantState: {},
    consents: {},
    activeAssessment: null,
  };
}

describe('flowRestarted reducer', () => {
  it('resets pipelineActivityOrder to 0', () => {
    const state = stateWithFlowProgress();
    const next = reducer(
      state,
      actions.flowRestarted({ flowId, eventId, targetSubjectId, activityId: firstActivityId }),
    );
    expect((next.groupProgress[progressId] as FlowProgress).pipelineActivityOrder).toBe(0);
  });

  it('updates currentActivityId to the first activity', () => {
    const state = stateWithFlowProgress();
    const next = reducer(
      state,
      actions.flowRestarted({ flowId, eventId, targetSubjectId, activityId: firstActivityId }),
    );
    expect((next.groupProgress[progressId] as FlowProgress).currentActivityId).toBe(
      firstActivityId,
    );
  });

  it('generates a new submitId', () => {
    const state = stateWithFlowProgress();
    const next = reducer(
      state,
      actions.flowRestarted({ flowId, eventId, targetSubjectId, activityId: firstActivityId }),
    );
    expect((next.groupProgress[progressId] as FlowProgress).submitId).not.toBe('old-submit-id');
  });

  it('updates startAt to a new timestamp', () => {
    const state = stateWithFlowProgress({ startAt: 1000 });
    const next = reducer(
      state,
      actions.flowRestarted({ flowId, eventId, targetSubjectId, activityId: firstActivityId }),
    );
    expect(next.groupProgress[progressId].startAt).toBeGreaterThan(1000);
  });

  // M2-10471: endAt must be cleared so consumers (ActivityGroupsBuildManager, useEntitiesSync,
  // useStartSurvey) treat the restarted flow as in-progress rather than completed.
  it('clears endAt to null when flow was previously completed', () => {
    const completionTime = Date.now() - 5000;
    const state = stateWithFlowProgress({ endAt: completionTime });
    const next = reducer(
      state,
      actions.flowRestarted({ flowId, eventId, targetSubjectId, activityId: firstActivityId }),
    );
    expect(next.groupProgress[progressId].endAt).toBeNull();
  });

  it('leaves endAt null when flow was already in-progress', () => {
    const state = stateWithFlowProgress({ endAt: null });
    const next = reducer(
      state,
      actions.flowRestarted({ flowId, eventId, targetSubjectId, activityId: firstActivityId }),
    );
    expect(next.groupProgress[progressId].endAt).toBeNull();
  });

  it('does nothing when no groupProgress exists for the flow', () => {
    const state = stateWithFlowProgress();
    const unknownProgressId = getProgressId('unknown-flow', eventId, null);
    const next = reducer(
      state,
      actions.flowRestarted({
        flowId: 'unknown-flow',
        eventId,
        targetSubjectId: null,
        activityId: firstActivityId,
      }),
    );
    expect(next.groupProgress[unknownProgressId]).toBeUndefined();
    // Original entry must be untouched
    expect(next.groupProgress[progressId]).toEqual(state.groupProgress[progressId]);
  });
});
