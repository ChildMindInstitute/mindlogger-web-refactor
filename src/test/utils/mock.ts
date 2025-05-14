import { ActivityPipelineType, GroupProgressId, GroupProgressState } from '~/abstract/lib';
import { AvailabilityLabelType } from '~/entities/event';
import {
  ActivityBaseDTO,
  ActivityFlowDTO,
  AppletEventsResponse,
  HydratedAssignmentDTO,
  ScheduleEventDto,
} from '~/shared/api';
import { SubjectDTO } from '~/shared/api/types/subject';

export const mockAppletId = 'applet-1';

export const mockActivityId1 = 'activity-1';
export const mockActivityId2 = 'activity-2';
export const mockActivityId3 = 'activity-3';
export const mockActivityId4 = 'activity-4';

export const mockActivities: ActivityBaseDTO[] = [
  {
    id: mockActivityId1,
    name: 'Test Activity',
    description: '',
    image: '',
    isHidden: false,
    order: 0,
    containsResponseTypes: ['singleSelect'],
    itemCount: 1,
    autoAssign: true,
  },
  {
    id: mockActivityId2,
    name: 'Hidden Activity',
    description: '',
    image: '',
    isHidden: true,
    order: 1,
    containsResponseTypes: ['singleSelect'],
    itemCount: 1,
    autoAssign: true,
  },
  {
    id: mockActivityId3,
    name: 'Manually Assigned Activity',
    description: '',
    image: '',
    isHidden: false,
    order: 2,
    containsResponseTypes: ['singleSelect'],
    itemCount: 1,
    autoAssign: false,
  },
  {
    id: mockActivityId4,
    name: 'Manually Assigned Activity 2',
    description: '',
    image: '',
    isHidden: false,
    order: 3,
    containsResponseTypes: ['singleSelect'],
    itemCount: 1,
    autoAssign: false,
  },
];

export const mockFlowId1 = 'flow-1';
export const mockFlowId2 = 'flow-2';
export const mockFlowId3 = 'flow-3';

export const mockFlows: ActivityFlowDTO[] = [
  {
    id: mockFlowId1,
    name: 'Test Flow',
    description: '',
    image: '',
    isSingleReport: false,
    hideBadge: false,
    order: 0,
    isHidden: false,
    activityIds: [mockActivityId1, mockActivityId2, mockActivityId3],
    autoAssign: true,
  },
  {
    id: mockFlowId2,
    name: 'Hidden Flow',
    description: '',
    image: '',
    isSingleReport: false,
    hideBadge: false,
    order: 1,
    isHidden: true,
    activityIds: [mockActivityId1, mockActivityId2, mockActivityId3],
    autoAssign: true,
  },
  {
    id: mockFlowId3,
    name: 'Manually Assigned Flow',
    description: '',
    image: '',
    isSingleReport: false,
    hideBadge: false,
    order: 2,
    isHidden: false,
    activityIds: [mockActivityId1, mockActivityId2, mockActivityId3],
    autoAssign: false,
  },
];

export const mockUserId1 = 'user-1';

export const mockSubjectId1 = 'subject-1';
export const mockSubjectId2 = 'subject-2';

export const mockSubject1: SubjectDTO = {
  id: mockSubjectId1,
  userId: mockUserId1,
  firstName: 'Full',
  lastName: 'Account',
  secretUserId: 'subject-secret-1',
  appletId: mockAppletId,
  nickname: 'Full Account',
  tag: null,
  lastSeen: null,
};
export const mockSubject2: SubjectDTO = {
  id: mockSubjectId2,
  userId: null,
  firstName: 'Limited',
  lastName: 'Account',
  secretUserId: 'subject-secret-2',
  appletId: mockAppletId,
  nickname: 'Limited Account',
  tag: null,
  lastSeen: null,
};

export const mockAssignments: HydratedAssignmentDTO[] = [
  {
    activityId: mockActivityId1,
    activityFlowId: null,
    respondentSubject: mockSubject1,
    targetSubject: mockSubject1,
  },
  {
    activityId: mockActivityId3,
    activityFlowId: null,
    respondentSubject: mockSubject1,
    targetSubject: mockSubject1,
  },
  {
    activityId: mockActivityId3,
    activityFlowId: null,
    respondentSubject: mockSubject1,
    targetSubject: mockSubject2,
  },
  {
    activityId: null,
    activityFlowId: mockFlowId3,
    respondentSubject: mockSubject1,
    targetSubject: mockSubject1,
  },
  {
    activityId: null,
    activityFlowId: mockFlowId3,
    respondentSubject: mockSubject1,
    targetSubject: mockSubject2,
  },
];

const mockEventId1 = 'event-1';
const mockEventId2 = 'event-2';
const mockEventId3 = 'event-3';
const mockEventId4 = 'event-4';
const mockEventId5 = 'event-5';
const mockEventId6 = 'event-6';

export const mockEvent: ScheduleEventDto = {
  id: mockEventId6,
  entityId: mockFlowId3,
  availabilityType: AvailabilityLabelType.AlwaysAvailable,
  availability: {
    oneTimeCompletion: false,
    periodicityType: 'ALWAYS',
    timeFrom: { hours: 0, minutes: 0 },
    timeTo: { hours: 0, minutes: 0 },
    allowAccessBeforeFromTime: false,
  },
  selectedDate: null,
  timers: {
    timer: null,
    idleTimer: null,
  },
};

export const mockEventsResponse: AppletEventsResponse = {
  events: [
    {
      id: mockEventId1,
      entityId: mockActivityId1,
      availabilityType: AvailabilityLabelType.AlwaysAvailable,
      availability: {
        oneTimeCompletion: false,
        periodicityType: 'ALWAYS',
        timeFrom: { hours: 0, minutes: 0 },
        timeTo: { hours: 0, minutes: 0 },
        allowAccessBeforeFromTime: false,
      },
      selectedDate: null,
      timers: {
        timer: null,
        idleTimer: null,
      },
    },
    {
      id: mockEventId2,
      entityId: mockActivityId2,
      availabilityType: AvailabilityLabelType.AlwaysAvailable,
      availability: {
        oneTimeCompletion: false,
        periodicityType: 'ALWAYS',
        timeFrom: { hours: 0, minutes: 0 },
        timeTo: { hours: 0, minutes: 0 },
        allowAccessBeforeFromTime: false,
      },
      selectedDate: null,
      timers: {
        timer: null,
        idleTimer: null,
      },
    },
    {
      id: mockEventId3,
      entityId: mockActivityId3,
      availabilityType: AvailabilityLabelType.ScheduledAccess,
      availability: {
        oneTimeCompletion: false,
        periodicityType: 'DAILY',
        timeFrom: { hours: 20, minutes: 0 },
        timeTo: { hours: 24, minutes: 0 },
        allowAccessBeforeFromTime: false,
      },
      selectedDate: null,
      timers: {
        timer: null,
        idleTimer: null,
      },
    },
    {
      id: mockEventId4,
      entityId: mockFlowId1,
      availabilityType: AvailabilityLabelType.AlwaysAvailable,
      availability: {
        oneTimeCompletion: false,
        periodicityType: 'ALWAYS',
        timeFrom: { hours: 0, minutes: 0 },
        timeTo: { hours: 0, minutes: 0 },
        allowAccessBeforeFromTime: false,
      },
      selectedDate: null,
      timers: {
        timer: null,
        idleTimer: null,
      },
    },
    {
      id: mockEventId5,
      entityId: mockFlowId2,
      availabilityType: AvailabilityLabelType.AlwaysAvailable,
      availability: {
        oneTimeCompletion: false,
        periodicityType: 'ALWAYS',
        timeFrom: { hours: 0, minutes: 0 },
        timeTo: { hours: 0, minutes: 0 },
        allowAccessBeforeFromTime: false,
      },
      selectedDate: null,
      timers: {
        timer: null,
        idleTimer: null,
      },
    },
    mockEvent,
  ],
};

export const mockEntityProgressId: GroupProgressId = `${mockFlowId3}/${mockEventId6}`;

export const mockEntityProgress: GroupProgressState = {
  [mockEntityProgressId]: {
    type: ActivityPipelineType.Flow,
    currentActivityId: mockActivityId1,
    pipelineActivityOrder: 1,
    currentActivityStartAt: null,
    submitId: 'test-key',
    context: { summaryData: {} },
    startAt: 1,
    endAt: null,
    event: mockEvent,
  },
};
