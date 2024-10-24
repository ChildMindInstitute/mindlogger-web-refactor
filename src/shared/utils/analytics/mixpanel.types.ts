export enum MixpanelProps {
  Feature = 'Feature',
  AppletId = 'Applet ID',
  SubmitId = 'Submit ID',
  ActivityId = 'Activity ID',
  ActivityFlowId = 'Activity Flow ID',
  MultiInformantAssessmentId = 'Multi-informant Assessment ID',
  ItemTypes = 'Item Types',
}

export type MixpanelPayload = Partial<Record<MixpanelProps, unknown>>;

export const MixpanelEvents = {
  ActivityRestarted: 'Activity Restart Button Pressed',
  ActivityResumed: 'Activity Resume Button Pressed',
  AppletClick: 'Applet click',
  AssessmentCompleted: 'Assessment completed',
  AssessmentStarted: 'Assessment Started',
  InvitationAccepted: 'Invitation Accepted',
  ReturnToAdminApp: 'Return to Admin App button clicked',
  ReportDownloadClicked: 'Report Download Clicked',
  ReportGenerated: 'Report Generated',
  SaveAndExitClicked: 'Save & Exit Clicked',
  TransferOwnershipAccepted: 'Transfer Ownership Accepted',
};
