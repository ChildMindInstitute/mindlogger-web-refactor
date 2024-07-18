export type MultiInformantSubject = {
  id: string;
  secretId: string | null;
  nickname: string | null;
};

export type MultiInformantState = {
  currentUserSubject?: MultiInformantSubject;
  sourceSubject?: MultiInformantSubject;
  targetSubject?: MultiInformantSubject;
  appletId?: string;
  activityId?: string | null;
  activityFlowId?: string | null;
  multiInformantAssessmentId?: string | null;
  submitId?: string | null;
};
