import { ItemResponseTypeDTO } from '~/shared/api';

export enum MixpanelProps {
  Feature = 'Feature',
  AppletId = 'Applet ID',
  SubmitId = 'Submit ID',
  ActivityId = 'Activity ID',
  ActivityFlowId = 'Activity Flow ID',
  MultiInformantAssessmentId = 'Multi-informant Assessment ID',
  ItemTypes = 'Item Types',
}

export enum MixpanelFeature {
  MultiInformant = 'Multi-informant',
  SSI = 'SSI',
}

export enum MixpanelEventType {
  ActivityRestarted = 'Activity Restart Button Pressed',
  ActivityResumed = 'Activity Resume Button Pressed',
  AppletClick = 'Applet click',
  AssessmentCompleted = 'Assessment completed',
  AssessmentStarted = 'Assessment Started',
  InvitationAccepted = 'Invitation Accepted',
  LoginBtnClick = 'Login Button click',
  LoginScreenCreateAccountBtnClick = 'Create account button on login screen click',
  LoginSuccessful = 'Login Successful',
  Logout = 'logout',
  ReportDownloadClicked = 'Report Download Clicked',
  ReportGenerated = 'Report Generated',
  ReturnToAdminApp = 'Return to Admin App button clicked',
  SaveAndExitClicked = 'Save & Exit Clicked',
  SignupSuccessful = 'Signup Successful',
  TransferOwnershipAccepted = 'Transfer Ownership Accepted',
  TransferOwnershipDeclined = 'Transfer Ownership Declined',
}

type WithAppletId<T> = T & { [MixpanelProps.AppletId]?: string | null };

export type WithFeature<T = object> = T & {
  [MixpanelProps.Feature]?: MixpanelFeature[];
};

export type AppletClickEvent = WithAppletId<{
  action: MixpanelEventType.AppletClick;
}>;

export type TransferOwnershipAcceptedEvent = WithAppletId<{
  action: MixpanelEventType.TransferOwnershipAccepted;
}>;

export type AssessmentCompletedEvent = WithFeature<
  WithAppletId<{
    action: MixpanelEventType.AssessmentCompleted;
    [MixpanelProps.SubmitId]: string;
    [MixpanelProps.ActivityId]?: string;
    [MixpanelProps.ActivityFlowId]?: string;
    [MixpanelProps.MultiInformantAssessmentId]?: string;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type AssessmentStartedEvent = WithFeature<
  WithAppletId<{
    action: MixpanelEventType.AssessmentStarted;
    [MixpanelProps.ActivityId]?: string;
    [MixpanelProps.ActivityFlowId]?: string;
    [MixpanelProps.MultiInformantAssessmentId]?: string;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type InvitationAcceptedEvent = WithAppletId<{
  action: MixpanelEventType.InvitationAccepted;
}>;

export type ActivityRestartedEvent = WithFeature<
  WithAppletId<{
    action: MixpanelEventType.ActivityRestarted;
    [MixpanelProps.ActivityId]?: string;
    [MixpanelProps.ActivityFlowId]?: string | null;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type ActivityResumedEvent = WithFeature<
  WithAppletId<{
    action: MixpanelEventType.ActivityResumed;
    [MixpanelProps.ActivityId]?: string;
    [MixpanelProps.ActivityFlowId]?: string | null;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type ReturnToAdminAppEvent = WithFeature<
  WithAppletId<{
    action: MixpanelEventType.ReturnToAdminApp;
    [MixpanelProps.SubmitId]?: string | null;
    [MixpanelProps.ActivityId]?: string;
    [MixpanelProps.ActivityFlowId]?: string;
    [MixpanelProps.MultiInformantAssessmentId]?: string;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
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

export type ReportDownloadClickedEvent = WithFeature<
  WithAppletId<{
    action: MixpanelEventType.ReportDownloadClicked;
    [MixpanelProps.ActivityId]?: string;
    [MixpanelProps.ActivityFlowId]?: string;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type ReportGeneratedEvent = WithFeature<
  WithAppletId<{
    action: MixpanelEventType.ReportGenerated;
    [MixpanelProps.ActivityId]?: string;
    [MixpanelProps.ActivityFlowId]?: string;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type SaveAndExitClickedEvent = WithFeature<
  WithAppletId<{
    action: MixpanelEventType.SaveAndExitClicked;
    [MixpanelProps.ActivityId]?: string;
    [MixpanelProps.ActivityFlowId]?: string;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
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
  | AppletClickEvent
  | TransferOwnershipAcceptedEvent
  | AssessmentCompletedEvent
  | AssessmentStartedEvent
  | InvitationAcceptedEvent
  | ActivityRestartedEvent
  | ActivityResumedEvent
  | ReturnToAdminAppEvent
  | LoginSuccessfulEvent
  | LoginBtnClickEvent
  | LogoutEvent
  | ReportDownloadClickedEvent
  | ReportGeneratedEvent
  | SaveAndExitClickedEvent
  | SignupSuccessfulEvent
  | TransferOwnershipDeclinedEvent
  | LoginScreenCreateAccountBtnClickEvent;
