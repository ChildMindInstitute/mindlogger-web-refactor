import { SubjectDTO } from './subject';

import { BaseSuccessResponse } from '~/shared/api/types/base';
export interface GetMyAssignmentsPayload {
  appletId: string;
}

type AssignmentWithActivity = {
  activityId: string;
  activityFlowId: null;
};

type AssignmentWithFlow = {
  activityId: null;
  activityFlowId: string;
};

export type HydratedAssignmentDTO = (AssignmentWithActivity | AssignmentWithFlow) & {
  respondentSubject: SubjectDTO;
  targetSubject: SubjectDTO;
};

export type MyAssignmentsDTO = {
  appletId: string;
  assignments: HydratedAssignmentDTO[];
};

export type MyAssignmentsSuccessResponse = BaseSuccessResponse<MyAssignmentsDTO>;
