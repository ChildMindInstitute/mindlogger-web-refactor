import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useStartSurvey } from './useStartSurvey';

import { ActivityPipelineType, FlowProgress, GroupProgress } from '~/abstract/lib';
import { AppletBaseDTO } from '~/shared/api';
import {
  mockActivityId1,
  mockActivityId2,
  mockAppletId,
  mockFlowId1,
  mockFlows,
} from '~/test/utils/mock';

// Mock functions
const mockRemoveActivityProgress = vi.fn();
const mockFlowRestarted = vi.fn();
const mockActivityRestarted = vi.fn();
const mockGetGroupProgress = vi.fn();
const mockNavigate = vi.fn();

vi.mock('~/entities/applet', () => ({
  appletModel: {
    hooks: {
      useGroupProgressStateManager: () => ({
        flowRestarted: mockFlowRestarted,
        activityRestarted: mockActivityRestarted,
        getGroupProgress: mockGetGroupProgress,
      }),
      useActivityProgress: () => ({
        removeActivityProgress: mockRemoveActivityProgress,
      }),
      useMultiInformantState: () => ({
        isInMultiInformantFlow: () => false,
        getMultiInformantState: () => ({}),
      }),
    },
  },
  prolificParamsSelector: () => null,
}));

vi.mock('~/entities/applet/model/selectors', () => ({
  prolificParamsSelector: () => null,
}));

vi.mock('~/shared/utils', () => ({
  useCustomNavigation: () => ({ navigate: mockNavigate }),
  useAppSelector: () => null,
  Mixpanel: { track: vi.fn() },
  MixpanelEventType: { AssessmentStarted: 'AssessmentStarted' },
  MixpanelProps: {},
}));

vi.mock('~/shared/utils/analytics', () => ({
  addFeatureToEvent: vi.fn(),
  addSurveyPropsToEvent: () => ({}),
  MixpanelFeature: {},
}));

// Test data
const mockEventId = 'event-4'; // event for mockFlowId1

const mockApplet: AppletBaseDTO = {
  id: mockAppletId,
  displayName: 'Test Applet',
  version: '1.0.0',
  description: '',
  about: '',
  image: '',
  watermark: '',
  createdAt: '2024-01-01T00:00:00',
  updatedAt: '2024-01-01T00:00:00',
  activityFlows: mockFlows,
  activities: [],
  encryption: null,
};

const defaultProps = {
  applet: mockApplet,
  isPublic: false,
  publicAppletKey: null,
};

// Helper to build a GroupProgress that looks like "in progress"
function makeInProgressGroupProgress(overrides?: Partial<GroupProgress>): GroupProgress {
  const base: FlowProgress = {
    type: ActivityPipelineType.Flow,
    currentActivityId: mockActivityId1,
    pipelineActivityOrder: 0,
    submitId: 'in-progress-submit-id',
  };
  return {
    ...base,
    startAt: Date.now(),
    endAt: null,
    context: { summaryData: {} },
    ...overrides,
  } as GroupProgress;
}

// Helper to build a GroupProgress that looks like "completed"
function makeCompletedGroupProgress(overrides?: Partial<GroupProgress>): GroupProgress {
  const base: FlowProgress = {
    type: ActivityPipelineType.Flow,
    currentActivityId: mockActivityId1,
    pipelineActivityOrder: 0,
    submitId: 'completed-submit-id',
  };
  return {
    ...base,
    startAt: Date.now() - 60_000,
    endAt: Date.now(),
    context: { summaryData: {} },
    ...overrides,
  } as GroupProgress;
}

describe('useStartSurvey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetGroupProgress.mockReturnValue(null);
  });

  // Flow branch
  describe('Flow: startSurvey with flowId', () => {
    // Restart case (shouldRestart = true)
    it('should call removeActivityProgress and flowRestarted when shouldRestart is true', () => {
      const { result } = renderHook(() => useStartSurvey(defaultProps));

      result.current.startSurvey({
        activityId: mockActivityId1,
        flowId: mockFlowId1,
        eventId: mockEventId,
        targetSubjectId: null,
        shouldRestart: true,
      });

      expect(mockRemoveActivityProgress).toHaveBeenCalledWith({
        activityId: mockActivityId1,
        eventId: mockEventId,
        targetSubjectId: null,
      });

      expect(mockFlowRestarted).toHaveBeenCalledWith({
        flowId: mockFlowId1,
        eventId: mockEventId,
        targetSubjectId: null,
        activityId: mockFlows[0].activityIds[0], // first activity in flow
      });
    });

    // Start case (no group progress / first time)
    it('should clear activity progress when no group progress exists (first start)', () => {
      mockGetGroupProgress.mockReturnValue(null);

      const { result } = renderHook(() => useStartSurvey(defaultProps));

      result.current.startSurvey({
        activityId: mockActivityId1,
        flowId: mockFlowId1,
        eventId: mockEventId,
        targetSubjectId: null,
        shouldRestart: false,
      });

      expect(mockGetGroupProgress).toHaveBeenCalledWith({
        entityId: mockFlowId1,
        eventId: mockEventId,
        targetSubjectId: null,
      });

      expect(mockRemoveActivityProgress).toHaveBeenCalledWith({
        activityId: mockActivityId1,
        eventId: mockEventId,
        targetSubjectId: null,
      });

      // Should NOT call restart actions
      expect(mockFlowRestarted).not.toHaveBeenCalled();
      expect(mockActivityRestarted).not.toHaveBeenCalled();
    });

    // Start after completed on another device (the bug fix case)
    it('should clear activity progress when entity has been completed (endAt is set)', () => {
      mockGetGroupProgress.mockReturnValue(makeCompletedGroupProgress());

      const { result } = renderHook(() => useStartSurvey(defaultProps));

      result.current.startSurvey({
        activityId: mockActivityId2,
        flowId: mockFlowId1,
        eventId: mockEventId,
        targetSubjectId: null,
        shouldRestart: false,
      });

      expect(mockGetGroupProgress).toHaveBeenCalledWith({
        entityId: mockFlowId1,
        eventId: mockEventId,
        targetSubjectId: null,
      });

      expect(mockRemoveActivityProgress).toHaveBeenCalledWith({
        activityId: mockActivityId2,
        eventId: mockEventId,
        targetSubjectId: null,
      });
    });

    // Resume case (entity in progress)
    it('should NOT clear activity progress when entity is in progress (resume case)', () => {
      mockGetGroupProgress.mockReturnValue(makeInProgressGroupProgress());

      const { result } = renderHook(() => useStartSurvey(defaultProps));

      result.current.startSurvey({
        activityId: mockActivityId1,
        flowId: mockFlowId1,
        eventId: mockEventId,
        targetSubjectId: null,
        shouldRestart: false,
      });

      expect(mockGetGroupProgress).toHaveBeenCalledWith({
        entityId: mockFlowId1,
        eventId: mockEventId,
        targetSubjectId: null,
      });

      // Must NOT remove — user is resuming, their answers should stay
      expect(mockRemoveActivityProgress).not.toHaveBeenCalled();
    });
  });

  // Regular activity branch (no flowId)
  describe('Regular activity: startSurvey without flowId', () => {
    const activityEventId = 'event-1'; // event for mockActivityId1

    // Restart case
    it('should call removeActivityProgress and activityRestarted when shouldRestart is true', () => {
      const { result } = renderHook(() => useStartSurvey(defaultProps));

      result.current.startSurvey({
        activityId: mockActivityId1,
        flowId: null,
        eventId: activityEventId,
        targetSubjectId: null,
        shouldRestart: true,
      });

      expect(mockRemoveActivityProgress).toHaveBeenCalledWith({
        activityId: mockActivityId1,
        eventId: activityEventId,
        targetSubjectId: null,
      });

      expect(mockActivityRestarted).toHaveBeenCalledWith({
        activityId: mockActivityId1,
        eventId: activityEventId,
        targetSubjectId: null,
      });
    });

    // Start after completed on another device
    it('should clear activity progress when entity has been completed (endAt is set)', () => {
      mockGetGroupProgress.mockReturnValue(makeCompletedGroupProgress());

      const { result } = renderHook(() => useStartSurvey(defaultProps));

      result.current.startSurvey({
        activityId: mockActivityId1,
        flowId: null,
        eventId: activityEventId,
        targetSubjectId: null,
        shouldRestart: false,
      });

      expect(mockGetGroupProgress).toHaveBeenCalledWith({
        entityId: mockActivityId1,
        eventId: activityEventId,
        targetSubjectId: null,
      });

      expect(mockRemoveActivityProgress).toHaveBeenCalledWith({
        activityId: mockActivityId1,
        eventId: activityEventId,
        targetSubjectId: null,
      });
    });

    // Resume case (entity in progress)
    it('should NOT clear activity progress when entity is in progress (resume case)', () => {
      mockGetGroupProgress.mockReturnValue(makeInProgressGroupProgress());

      const { result } = renderHook(() => useStartSurvey(defaultProps));

      result.current.startSurvey({
        activityId: mockActivityId1,
        flowId: null,
        eventId: activityEventId,
        targetSubjectId: null,
        shouldRestart: false,
      });

      expect(mockGetGroupProgress).toHaveBeenCalledWith({
        entityId: mockActivityId1,
        eventId: activityEventId,
        targetSubjectId: null,
      });

      // Must NOT remove — user is resuming
      expect(mockRemoveActivityProgress).not.toHaveBeenCalled();
    });

    // Start case (no prior group progress)
    it('should clear activity progress when no group progress exists (first start)', () => {
      mockGetGroupProgress.mockReturnValue(null);

      const { result } = renderHook(() => useStartSurvey(defaultProps));

      result.current.startSurvey({
        activityId: mockActivityId1,
        flowId: null,
        eventId: activityEventId,
        targetSubjectId: null,
        shouldRestart: false,
      });

      expect(mockRemoveActivityProgress).toHaveBeenCalledWith({
        activityId: mockActivityId1,
        eventId: activityEventId,
        targetSubjectId: null,
      });
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    it('should do nothing if applet is undefined', () => {
      const { result } = renderHook(() =>
        useStartSurvey({ applet: undefined, isPublic: false, publicAppletKey: null }),
      );

      result.current.startSurvey({
        activityId: mockActivityId1,
        flowId: null,
        eventId: 'event-1',
        targetSubjectId: null,
        shouldRestart: false,
      });

      expect(mockRemoveActivityProgress).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should pass targetSubjectId through when clearing stale progress', () => {
      const targetSubjectId = 'subject-1';
      mockGetGroupProgress.mockReturnValue(makeCompletedGroupProgress());

      const { result } = renderHook(() => useStartSurvey(defaultProps));

      result.current.startSurvey({
        activityId: mockActivityId1,
        flowId: null,
        eventId: 'event-1',
        targetSubjectId,
        shouldRestart: false,
      });

      expect(mockGetGroupProgress).toHaveBeenCalledWith({
        entityId: mockActivityId1,
        eventId: 'event-1',
        targetSubjectId,
      });

      expect(mockRemoveActivityProgress).toHaveBeenCalledWith({
        activityId: mockActivityId1,
        eventId: 'event-1',
        targetSubjectId,
      });
    });
  });
});
