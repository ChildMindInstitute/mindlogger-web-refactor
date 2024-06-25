export enum MixpanelProps {
  Feature = 'Feature',
  AppletId = 'Applet ID',
  SubmitId = 'Submit ID',
  ActivityId = 'Activity ID',
  ActivityFlowId = 'Activity Flow ID',
  MultiInformantAssessmentId = 'Multi-informant Assessment ID',
}

export type MixpanelPayload = Partial<Record<MixpanelProps, unknown>>;

export const MixpanelEvents = {
  AppletClick: 'Applet click',
  TransferOwnershipAccepted: 'Transfer Ownership Accepted',
  AssessmentCompleted: 'Assessment completed',
  AssessmentStarted: 'Assessment Started',
  InvitationAccepted: 'Invitation Accepted',
  ActivityRestarted: 'Activity Restart Button Pressed',
  ActivityResumed: 'Activity Resume Button Pressed',
  ReturnToAdminApp: 'Return to Admin App button clicked',
};
