import { BaseSuccessResponse } from '~/shared/api';

export interface GetSubjectByIdPayload {
  subjectId: string;
}

export type SubjectDTO = {
  secretUserId: string;
  appletId: string;
  nickname: string | null;
  tag: string | null;
  lastSeen: string | null;
};

export type GetSubjectSuccessResponse = BaseSuccessResponse<SubjectDTO>;
