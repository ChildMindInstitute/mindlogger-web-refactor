import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EntitiesSyncProps, useEntitiesSync } from './useEntitiesSync';

import { ActivityPipelineType, FlowProgress, GroupProgress } from '~/abstract/lib';
import { AppletBaseDTO, CompletedEntityDTO } from '~/shared/api';
import {
  mockActivities,
  mockActivityId1,
  mockActivityId3,
  mockAppletId,
  mockEventsResponse,
  mockFlowId1,
  mockFlows,
} from '~/test/utils/mock';

const mockSaveGroupProgress = vi.fn();
const mockGetGroupProgress = vi.fn();

vi.mock('~/entities/applet', () => ({
  appletModel: {
    hooks: {
      useGroupProgressStateManager: () => ({
        saveGroupProgress: mockSaveGroupProgress,
        getGroupProgress: mockGetGroupProgress,
      }),
    },
  },
}));

const mockApplet = {
  activities: mockActivities,
  activityFlows: mockFlows,
} as AppletBaseDTO;

// Extract events from mockEventsResponse for the entities we're testing
const mockActivityEvent = mockEventsResponse.events.find((e) => e.entityId === mockActivityId1)!;
const mockFlowEvent = mockEventsResponse.events.find((e) => e.entityId === mockFlowId1)!;

// Base completed entity (server)
const baseCompletedEntity: CompletedEntityDTO = {
  id: mockActivityId1,
  answerId: 'answer-id',
  submitId: 'server-submit-id', // test with different submit ID
  targetSubjectId: null,
  scheduledEventId: mockActivityEvent.id,
  startTime: new Date('2020-01-01T00:00:00').getTime(),
  endTime: new Date('2020-02-02T02:20:00').getTime(),
  localEndDate: '2020-02-02',
  localEndTime: '02:20:00',
  isFlowCompleted: null,
  activityFlowOrder: null,
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
        applet: mockApplet,
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
        events: [mockFlowEvent],
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      expect(mockSaveGroupProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          progressPayload: expect.objectContaining({
            pipelineActivityOrder: 2,
            currentActivityId: mockActivityId3,
          }),
        }),
      );
    });

    it('should use local progress when local is ahead of server', () => {
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
        applet: mockApplet,
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
        events: [mockFlowEvent],
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

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
        applet: mockApplet,
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
        events: [mockFlowEvent],
      };
      renderHook(() => useEntitiesSync(serverCompletedEntities));

      expect(mockSaveGroupProgress).not.toHaveBeenCalled();
    });
  });

  describe('syncEntity - Case 2: Completed flow or activity with no local progress', () => {
    it('should create local completed flow for server completed flow', () => {
      const serverCompletedEntities: EntitiesSyncProps = {
        applet: mockApplet,
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
        events: [mockFlowEvent],
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
        applet: mockApplet,
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
        events: [mockActivityEvent],
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
        applet: mockApplet,
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
        events: [mockFlowEvent],
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
        applet: mockApplet,
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
        events: [mockActivityEvent],
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
