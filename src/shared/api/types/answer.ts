import { BaseSuccessResponse } from '~/shared/api';

export interface ValidateMultiInformantAssessmentPayload {
  appletId: string;
  sourceSubjectId?: string;
  targetSubjectId?: string;
  activityOrFlowId?: string;
}

export type MultiInformantAssessmentValidationCode =
  | 'invalid_source_subject'
  | 'invalid_target_subject'
  | 'invalid_activity_or_flow_id'
  | 'no_access_to_applet';

export type MultiInformantAssessmentValidationDTO = {
  valid: boolean;
  message?: string;
  code?: MultiInformantAssessmentValidationCode;
};

export type ValidateMultiInformantAssessmentResponse =
  BaseSuccessResponse<MultiInformantAssessmentValidationDTO>;
