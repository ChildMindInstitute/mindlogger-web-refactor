import { ItemResponseTypeDTO } from '~/shared/api';

export enum MixpanelProps {
  ActivityFlowId = 'Activity Flow ID',
  ActivityId = 'Activity ID',
  AppletId = 'Applet ID',
  Feature = 'Feature',
  ItemId = 'Item ID',
  ItemTypes = 'Item Types',
  MultiInformantAssessmentId = 'Multi-informant Assessment ID',
  TotalResponseReports = 'Total Response Reports',
  SubmitId = 'Submit ID',
  StudyUserId = 'Study User ID',
  StudyReference = 'Study Reference',
  EHRStatus = 'EHR Status',
}

export enum MixpanelFeature {
  MultiInformant = 'Multi-informant',
  SSI = 'SSI',
  Prolific = 'Prolific',
  EHR = 'EHR',
}

export enum EHRStatus {
  ParticipantDeclined = 'Participant Declined',
  ParticipantSkipped = 'Participant Skipped',
  ParticipantConsented = 'Participant Consented',
}

export enum MixpanelEventType {
  ActivityRestarted = 'Activity Restart Button Pressed',
  ActivityResumed = 'Activity Resume Button Pressed',
  AppletClick = 'Applet click',
  AssessmentCompleted = 'Assessment completed',
  AssessmentStarted = 'Assessment Started',
  EHRProviderSearch = 'EHR Provider Search',
  EHRProviderSearchSkipped = 'EHR Provider Search Skipped',
  EHRProviderShareSuccess = 'EHR Provider Share Success',
  InvitationAccepted = 'Invitation Accepted',
  LoginBtnClick = 'Login Button click',
  LoginScreenCreateAccountBtnClick = 'Create account button on login screen click',
  LoginSuccessful = 'Login Successful',
  Logout = 'logout',
  ResponseReportDownloadClicked = 'Response Report Download Clicked',
  ResponseReportGenerated = 'Response Report Generated',
  ReturnToAdminApp = 'Return to Admin App button clicked',
  SaveAndExitClicked = 'Save & Exit Clicked',
  SignupSuccessful = 'Signup Successful',
  TransferOwnershipAccepted = 'Transfer Ownership Accepted',
  TransferOwnershipDeclined = 'Transfer Ownership Declined',
}

type WithAppletId<T> = T & { [MixpanelProps.AppletId]?: string | null };

type WithAppletActivityOrFlowId<T> = WithAppletId<T> & {
  [MixpanelProps.ActivityId]?: string;
  [MixpanelProps.ActivityFlowId]?: string;
};

export type WithFeature<T = object> = T & {
  [MixpanelProps.Feature]?: MixpanelFeature[];
};

export type WithProlific<T> = T & {
  [MixpanelProps.StudyUserId]?: string;
  [MixpanelProps.StudyReference]?: string;
};

export type AppletClickEvent = WithAppletId<{
  action: MixpanelEventType.AppletClick;
}>;

export type TransferOwnershipAcceptedEvent = WithAppletId<{
  action: MixpanelEventType.TransferOwnershipAccepted;
}>;

export type AssessmentCompletedEvent = WithFeature<
  WithAppletActivityOrFlowId<{
    action: MixpanelEventType.AssessmentCompleted;
    [MixpanelProps.SubmitId]: string;
    [MixpanelProps.MultiInformantAssessmentId]?: string;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
    [MixpanelProps.EHRStatus]?: EHRStatus;
  }>
>;

export type AssessmentStartedEvent = WithFeature<
  WithAppletActivityOrFlowId<{
    action: MixpanelEventType.AssessmentStarted;
    [MixpanelProps.MultiInformantAssessmentId]?: string;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
    [MixpanelProps.StudyUserId]?: string;
    [MixpanelProps.StudyReference]?: string;
  }>
>;

export type EHRProviderSearchEvent = WithFeature<
  WithAppletActivityOrFlowId<{
    action: MixpanelEventType.EHRProviderSearch;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type EHRProviderSearchSkippedEvent = WithFeature<
  WithAppletActivityOrFlowId<{
    action: MixpanelEventType.EHRProviderSearchSkipped;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type EHRProviderShareSuccessEvent = WithFeature<
  WithAppletActivityOrFlowId<{
    action: MixpanelEventType.EHRProviderShareSuccess;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type InvitationAcceptedEvent = WithAppletId<{
  action: MixpanelEventType.InvitationAccepted;
}>;

export type ActivityRestartedEvent = WithFeature<
  WithAppletActivityOrFlowId<{
    action: MixpanelEventType.ActivityRestarted;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type ActivityResumedEvent = WithFeature<
  WithAppletActivityOrFlowId<{
    action: MixpanelEventType.ActivityResumed;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type ReturnToAdminAppEvent = WithFeature<
  WithAppletActivityOrFlowId<{
    action: MixpanelEventType.ReturnToAdminApp;
    [MixpanelProps.SubmitId]?: string | null;
    [MixpanelProps.MultiInformantAssessmentId]?: string;
  }>
>;

export type LoginSuccessfulEvent = {
  action: MixpanelEventType.LoginSuccessful;
};

export type LoginBtnClickEvent = {
  action: MixpanelEventType.LoginBtnClick;
};

export type LogoutEvent = {
  action: MixpanelEventType.Logout;
};

export type ResponseReportDownloadClickedEvent = WithFeature<
  WithAppletActivityOrFlowId<
    WithAppletId<{
      action: MixpanelEventType.ResponseReportDownloadClicked;
      [MixpanelProps.ItemId]: string;
      [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
      [MixpanelProps.TotalResponseReports]: number;
    }>
  >
>;

export type ResponseReportGeneratedEvent = WithFeature<
  WithAppletActivityOrFlowId<
    WithAppletId<{
      action: MixpanelEventType.ResponseReportGenerated;
      [MixpanelProps.ItemId]: string;
      [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
      [MixpanelProps.TotalResponseReports]: number;
    }>
  >
>;

export type SaveAndExitClickedEvent = WithFeature<
  WithAppletActivityOrFlowId<
    WithAppletId<{
      action: MixpanelEventType.SaveAndExitClicked;
      [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
    }>
  >
>;

export type SignupSuccessfulEvent = {
  action: MixpanelEventType.SignupSuccessful;
};

export type TransferOwnershipDeclinedEvent = {
  action: MixpanelEventType.TransferOwnershipDeclined;
};

export type LoginScreenCreateAccountBtnClickEvent = {
  action: MixpanelEventType.LoginScreenCreateAccountBtnClick;
};

export type MixpanelEvent =
  | ActivityRestartedEvent
  | ActivityResumedEvent
  | AppletClickEvent
  | AssessmentCompletedEvent
  | AssessmentStartedEvent
  | EHRProviderSearchEvent
  | EHRProviderSearchSkippedEvent
  | EHRProviderShareSuccessEvent
  | InvitationAcceptedEvent
  | LoginBtnClickEvent
  | LoginScreenCreateAccountBtnClickEvent
  | LoginSuccessfulEvent
  | LogoutEvent
  | ResponseReportDownloadClickedEvent
  | ResponseReportGeneratedEvent
  | ReturnToAdminAppEvent
  | SaveAndExitClickedEvent
  | SignupSuccessfulEvent
  | TransferOwnershipAcceptedEvent
  | TransferOwnershipDeclinedEvent;
