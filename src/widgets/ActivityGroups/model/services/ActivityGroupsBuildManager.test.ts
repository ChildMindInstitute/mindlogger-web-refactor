import { ActivityGroupsBuildManager } from './ActivityGroupsBuildManager';

import { ActivityGroupType } from '~/abstract/lib/GroupBuilder';
import {
  mockActivities,
  mockActivityId1,
  mockActivityId3,
  mockAssignments,
  mockEntityProgress,
  mockEventsResponse,
  mockFlowId1,
  mockFlowId3,
  mockFlows,
  mockSubject2,
} from '~/test/utils/mock';

jest.setSystemTime(new Date('2024-09-01T12:00:00.000Z'));

describe('ActivityGroupsBuildManager', () => {
  it('should build activity groups correctly with assignments disabled', () => {
    const { groups } = ActivityGroupsBuildManager.process({
      activities: mockActivities,
      flows: mockFlows,
      assignments: null,
      events: mockEventsResponse,
      entityProgress: {},
    });

    expect(groups).toMatchObject([
      {
        activities: [],
        type: ActivityGroupType.InProgress,
      },
      {
        activities: [
          { flowId: mockFlowId1 },
          { flowId: mockFlowId3 },
          { activityId: mockActivityId1 },
        ],
        type: ActivityGroupType.Available,
      },
      {
        activities: [{ activityId: mockActivityId3 }],
        type: ActivityGroupType.Scheduled,
      },
    ]);
  });

  it('should build activity groups correctly with assignments disabled and in-progress flow', () => {
    const { groups } = ActivityGroupsBuildManager.process({
      activities: mockActivities,
      flows: mockFlows,
      assignments: null,
      events: mockEventsResponse,
      entityProgress: mockEntityProgress,
    });

    expect(groups).toMatchObject([
      {
        activities: [{ flowId: mockFlowId3 }],
        type: ActivityGroupType.InProgress,
      },
      {
        activities: [{ flowId: mockFlowId1 }, { activityId: mockActivityId1 }],
        type: ActivityGroupType.Available,
      },
      {
        activities: [{ activityId: mockActivityId3 }],
        type: ActivityGroupType.Scheduled,
      },
    ]);
  });

  it('should build activity groups correctly with mock assignments', () => {
    const { groups } = ActivityGroupsBuildManager.process({
      activities: mockActivities,
      flows: mockFlows,
      assignments: mockAssignments,
      events: mockEventsResponse,
      entityProgress: {},
    });

    expect(groups).toMatchObject([
      {
        activities: [],
        type: ActivityGroupType.InProgress,
      },
      {
        activities: [
          { flowId: mockFlowId1 },
          { flowId: mockFlowId3 },
          { flowId: mockFlowId3, targetSubject: mockSubject2 },
          { activityId: mockActivityId1 },
        ],
        type: ActivityGroupType.Available,
      },
      {
        activities: [
          { activityId: mockActivityId3 },
          { activityId: mockActivityId3, targetSubject: mockSubject2 },
        ],
        type: ActivityGroupType.Scheduled,
      },
    ]);
  });

  it('should build activity groups correctly with mock assignments and in-progress flow', () => {
    const { groups } = ActivityGroupsBuildManager.process({
      activities: mockActivities,
      flows: mockFlows,
      assignments: mockAssignments,
      events: mockEventsResponse,
      entityProgress: mockEntityProgress,
    });

    expect(groups).toMatchObject([
      {
        activities: [{ flowId: mockFlowId3 }],
        type: ActivityGroupType.InProgress,
      },
      {
        activities: [
          { flowId: mockFlowId1 },
          { flowId: mockFlowId3, targetSubject: mockSubject2 },
          { activityId: mockActivityId1 },
        ],
        type: ActivityGroupType.Available,
      },
      {
        activities: [
          { activityId: mockActivityId3 },
          { activityId: mockActivityId3, targetSubject: mockSubject2 },
        ],
        type: ActivityGroupType.Scheduled,
      },
    ]);
  });

  it('should handle empty activities and flows', () => {
    const { groups } = ActivityGroupsBuildManager.process({
      activities: [],
      flows: [],
      assignments: null,
      events: { events: [] },
      entityProgress: {},
    });

    expect(groups).toMatchObject([
      {
        activities: [],
        type: ActivityGroupType.InProgress,
      },
      {
        activities: [],
        type: ActivityGroupType.Available,
      },
      {
        activities: [],
        type: ActivityGroupType.Scheduled,
      },
    ]);
  });

  it('should handle empty events', () => {
    const { groups } = ActivityGroupsBuildManager.process({
      activities: mockActivities,
      flows: mockFlows,
      assignments: mockAssignments,
      events: { events: [] },
      entityProgress: {},
    });

    expect(groups).toMatchObject([
      {
        activities: [],
        type: ActivityGroupType.InProgress,
      },
      {
        activities: [],
        type: ActivityGroupType.Available,
      },
      {
        activities: [],
        type: ActivityGroupType.Scheduled,
      },
    ]);
  });
});
