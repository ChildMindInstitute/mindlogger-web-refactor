import { BaseSuccessResponse } from '~/shared/api';

export interface GetSubjectByIdPayload {
  subjectId: string;
}

export interface GetMySubjectByAppletIdPayload {
  appletId: string;
}

export type SubjectDTO = {
  secretUserId: string;
  appletId: string;
  nickname: string | null;
  tag: string | null;
  lastSeen: string | null;
  id: string;
  userId: string | null;
  firstName: string;
  lastName: string;
};

export type GetSubjectSuccessResponse = BaseSuccessResponse<SubjectDTO>;

export type GetMySubjectSuccessResponse = GetSubjectSuccessResponse;
