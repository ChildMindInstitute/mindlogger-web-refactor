import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EntitiesSyncProps, useEntitiesSync } from './useEntitiesSync';

import { ActivityPipelineType, FlowProgress, GroupProgress } from '~/abstract/lib';
import { CompletedEntityDTO } from '~/shared/api';
import {
  mockActivityId1,
  mockActivityId2,
  mockActivityId3,
  mockAppletId,
  mockEventsResponse,
  mockFlowId1,
  mockFlows,
} from '~/test/utils/mock';

const mockSaveGroupProgress = vi.fn();
const mockGetGroupProgress = vi.fn();

const mockRemoveActivityProgress = vi.fn();

vi.mock('~/entities/applet', () => ({
  appletModel: {
    hooks: {
      useGroupProgressStateManager: () => ({
        saveGroupProgress: mockSaveGroupProgress,
        getGroupProgress: mockGetGroupProgress,
      }),
      useActivityProgress: () => ({
        removeActivityProgress: mockRemoveActivityProgress,
      }),
    },
  },
}));

// Extract events from mockEventsResponse for the entities we're testing
const mockActivityEvent = mockEventsResponse.events.find((e) => e.entityId === mockActivityId1)!;
const mockFlowEvent = mockEventsResponse.events.find((e) => e.entityId === mockFlowId1)!;

// Base completed entity (server)
const baseCompletedEntity: CompletedEntityDTO = {
  id: mockActivityId1,
  answerId: 'answer-id',
  submitId: 'server-submit-id', // test with different submit ID
  version: '1.0.0',
  targetSubjectId: null,
  scheduledEventId: mockActivityEvent.id,
  startTime: new Date('2020-01-01T00:00:00').getTime(),
  endTime: new Date('2020-02-02T02:20:00').getTime(),
  localEndDate: '2020-02-02',
  localEndTime: '02:20:00',
  isFlowCompleted: null,
  activityFlowOrder: null,
  flowActivityIds: null,
  flowName: null,
};

// Base flow progress (local)
const baseFlowProgress: FlowProgress = {
  type: ActivityPipelineType.Flow,
  currentActivityId: mockActivityId1,
  pipelineActivityOrder: 0,
  submitId: 'local-submit-id', // test with different submit ID
};

describe('useEntitiesSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetGroupProgress.mockReturnValue(null);
  });

  describe('syncEntity - Case 1: In-progress flow', () => {
    it('should use server progress when server is ahead of local', () => {
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        pipelineActivityOrder: 0,
        startAt: new Date('2020-01-01T00:00:00').getTime(),
        endAt: null,
        context: { summaryData: {} },
        event: mockFlowEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: false,
              activityFlowOrder: 2,
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      expect(mockSaveGroupProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          progressPayload: expect.objectContaining({
            pipelineActivityOrder: 2,
            currentActivityId: mockActivityId3,
            appletVersion: '1.0.0',
          }),
        }),
      );
    });

    it('should use server progress when local is ahead but from an older execution (different submitId)', () => {
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        pipelineActivityOrder: 2,
        startAt: new Date('2020-01-01T00:00:00').getTime(),
        endAt: null,
        context: { summaryData: {} },
        event: mockFlowEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: false,
              activityFlowOrder: 1,
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      // Server has a newer execution — local stale progress should be replaced
      expect(mockSaveGroupProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          progressPayload: expect.objectContaining({
            pipelineActivityOrder: 1,
            submitId: 'server-submit-id',
          }),
        }),
      );

      // Old activity progress should be cleared
      expect(mockRemoveActivityProgress).toHaveBeenCalledWith({
        activityId: mockActivityId1,
        eventId: mockFlowEvent.id,
        targetSubjectId: null,
      });
    });

    it('should use local progress when local is ahead and genuinely newer (started after server)', () => {
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        pipelineActivityOrder: 2,
        startAt: new Date('2020-03-01T00:00:00').getTime(),
        endAt: null,
        context: { summaryData: {} },
        event: mockFlowEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: false,
              activityFlowOrder: 1,
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      // Local started after server's endTime — local is genuinely newer, keep it
      expect(mockSaveGroupProgress).not.toHaveBeenCalled();
    });

    // Restart bug scenario (M2-10471): after a flow is completed and then restarted, the
    // flowRestarted reducer clears endAt and assigns a new submitId. This test verifies that
    // if local somehow still has a stale endAt (from before the flowRestarted fix), syncEntity
    // correctly skips — because the real fix is in flowRestarted (which now clears endAt).
    it('should skip sync when local has stale endAt from a prior completion (same submitId)', () => {
      // Simulates a device that has just restarted the flow: flowRestarted set a new submitId and
      // pipelineActivityOrder=0 but (before the fix) left endAt from the previous completion.
      // After the flowRestarted fix, this state can't occur — endAt is always cleared on restart.
      const priorCompletionTime = new Date('2020-02-01T00:00:00').getTime();
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        submitId: 'new-restart-submit-id',
        pipelineActivityOrder: 0,
        startAt: new Date('2020-02-05T00:00:00').getTime(),
        endAt: priorCompletionTime, // stale — not cleared by flowRestarted before the fix
        context: { summaryData: {} },
        event: mockFlowEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      // Server returns the same new in-progress execution at order 1
      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              submitId: 'new-restart-submit-id',
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: false,
              activityFlowOrder: 1,
              endTime: new Date('2020-02-06T00:00:00').getTime(),
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      // Local has endAt (completed) for same submitId — syncEntity skips to avoid overwriting
      // a completed state with in-progress. This is safe because flowRestarted now clears endAt,
      // so this stale state won't occur in practice.
      expect(mockSaveGroupProgress).not.toHaveBeenCalled();
    });

    it('should use local progress when local is at the same position as server', () => {
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        pipelineActivityOrder: 1,
        startAt: new Date('2020-01-10T01:10:00').getTime(),
        endAt: new Date('2020-02-20T02:20:00').getTime(),
        context: { summaryData: {} },
        event: mockFlowEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: false,
              activityFlowOrder: 1,
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      expect(mockSaveGroupProgress).not.toHaveBeenCalled();
    });

    it('should return empty changes when activity list page already synced (pre-empted sync)', () => {
      // Bug scenario: Activity list page calls useEntitiesSync first and updates Redux.
      // When the Survey page mounts and calls useEntitiesSync with the same data,
      // local progress already matches server → syncEntity returns false → changes is empty.
      // The SurveyWidget redirect useEffect must handle this via hasFreshServerData fallback.
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        submitId: 'same-submit-id',
        currentActivityId: mockActivityId2,
        pipelineActivityOrder: 1,
        startAt: new Date('2020-01-01T00:00:00').getTime(),
        endAt: null,
        context: { summaryData: {} },
        event: mockFlowEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              submitId: 'same-submit-id',
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: false,
              activityFlowOrder: 1,
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      const { result } = renderHook(() => useEntitiesSync(serverCompletedEntities));

      // Sync skips because local submitId matches server and local order >= server order
      expect(mockSaveGroupProgress).not.toHaveBeenCalled();
      // changes is empty — the flow ID is NOT included
      expect(result.current.changes).toEqual([]);
    });

    it('should return flow ID in changes when sync actually updates progress', () => {
      // Normal sync scenario: server is ahead, so syncEntity returns true → flow ID in changes
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        submitId: 'same-submit-id',
        currentActivityId: mockActivityId1,
        pipelineActivityOrder: 0,
        startAt: new Date('2020-01-01T00:00:00').getTime(),
        endAt: null,
        context: { summaryData: {} },
        event: mockFlowEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              submitId: 'same-submit-id',
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: false,
              activityFlowOrder: 2,
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      const { result } = renderHook(() => useEntitiesSync(serverCompletedEntities));

      // Sync updates because server is ahead (order 2 > local order 0)
      expect(mockSaveGroupProgress).toHaveBeenCalled();
      // changes contains the flow ID
      expect(result.current.changes).toEqual([mockFlowId1]);
    });

    it('should skip in-progress syncing when shouldRestart is true', () => {
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        pipelineActivityOrder: 0,
        startAt: new Date('2020-01-01T00:00:00').getTime(),
        endAt: null,
        context: { summaryData: {} },
        event: mockFlowEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: false,
              activityFlowOrder: 2,
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
        shouldRestart: true,
      };
      const { result } = renderHook(() => useEntitiesSync(serverCompletedEntities));

      // shouldRestart=true skips in-progress flow syncing entirely
      expect(mockSaveGroupProgress).not.toHaveBeenCalled();
      expect(result.current.changes).toEqual([]);
    });
  });

  describe('syncEntity - Case 2: Completed flow or activity with no local progress', () => {
    it('should create local completed flow for server completed flow', () => {
      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: true,
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      expect(mockSaveGroupProgress).toHaveBeenCalledWith({
        entityId: mockFlowId1,
        eventId: mockFlowEvent.id,
        targetSubjectId: null,
        progressPayload: expect.objectContaining({
          type: ActivityPipelineType.Flow,
          startAt: baseCompletedEntity.startTime,
          endAt: baseCompletedEntity.endTime,
          event: mockFlowEvent,
        }),
      });
    });

    it('should create local completed activity for server standalone activity', () => {
      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [
            {
              ...baseCompletedEntity,
              id: mockActivityId1,
              scheduledEventId: mockActivityEvent.id,
            },
          ],
          activityFlows: [],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockActivityEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      expect(mockSaveGroupProgress).toHaveBeenCalledWith({
        entityId: mockActivityId1,
        eventId: mockActivityEvent.id,
        targetSubjectId: null,
        progressPayload: expect.objectContaining({
          type: ActivityPipelineType.Regular,
          startAt: baseCompletedEntity.startTime,
          endAt: baseCompletedEntity.endTime,
          event: mockActivityEvent,
        }),
      });
    });
  });

  describe('syncEntity - Case 3: Completed flow or activity with local progress', () => {
    it('should complete local in-progress flow with server completed flow', () => {
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        startAt: new Date('2020-01-01T00:00:00').getTime(),
        endAt: null,
        context: { summaryData: {} },
        event: mockFlowEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: true,
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      expect(mockSaveGroupProgress).toHaveBeenCalledWith({
        entityId: mockFlowId1,
        eventId: mockFlowEvent.id,
        targetSubjectId: null,
        progressPayload: expect.objectContaining({
          endAt: baseCompletedEntity.endTime,
        }),
      });
    });

    it('should complete local in-progress activity with server standalone activity', () => {
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        type: ActivityPipelineType.Regular,
        startAt: new Date('2020-01-01T00:00:00').getTime(),
        endAt: null,
        context: { summaryData: {} },
        event: mockActivityEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [
            {
              ...baseCompletedEntity,
              id: mockActivityId1,
              scheduledEventId: mockActivityEvent.id,
            },
          ],
          activityFlows: [],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockActivityEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      expect(mockSaveGroupProgress).toHaveBeenCalledWith({
        entityId: mockActivityId1,
        eventId: mockActivityEvent.id,
        targetSubjectId: null,
        progressPayload: expect.objectContaining({
          endAt: baseCompletedEntity.endTime,
        }),
      });
    });

    it('should update local flow with server time when server is more recent', () => {
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        startAt: new Date('2020-01-01T00:00:00').getTime(),
        endAt: new Date('2020-01-10T01:10:00').getTime(),
        context: { summaryData: {} },
        event: mockFlowEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [],
          activityFlows: [
            {
              ...baseCompletedEntity,
              id: mockFlowId1,
              scheduledEventId: mockFlowEvent.id,
              isFlowCompleted: true,
            },
          ],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockFlowEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      expect(mockSaveGroupProgress).toHaveBeenCalledWith({
        entityId: mockFlowId1,
        eventId: mockFlowEvent.id,
        targetSubjectId: null,
        progressPayload: expect.objectContaining({
          endAt: baseCompletedEntity.endTime,
        }),
      });
    });

    it('should update local activity with server time when server is more recent', () => {
      const localProgress: GroupProgress = {
        ...baseFlowProgress,
        type: ActivityPipelineType.Regular,
        startAt: new Date('2020-01-01T00:00:00').getTime(),
        endAt: new Date('2020-01-10T01:10:00').getTime(),
        context: { summaryData: {} },
        event: mockActivityEvent,
      };
      mockGetGroupProgress.mockReturnValue(localProgress);

      const serverCompletedEntities: EntitiesSyncProps = {
        completedEntities: {
          id: mockAppletId,
          version: '1.0.0',
          activities: [
            {
              ...baseCompletedEntity,
              id: mockActivityId1,
              scheduledEventId: mockActivityEvent.id,
            },
          ],
          activityFlows: [],
        },
        appletId: mockAppletId,
        respondentSubjectId: null,
        events: [mockActivityEvent],
        activityFlows: mockFlows,
        flowResumeEnabled: true,
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      expect(mockSaveGroupProgress).toHaveBeenCalledWith({
        entityId: mockActivityId1,
        eventId: mockActivityEvent.id,
        targetSubjectId: null,
        progressPayload: expect.objectContaining({
          endAt: baseCompletedEntity.endTime,
        }),
      });
    });
  });
});
