import { ItemResponseTypeDTO } from '~/shared/api';

export enum MixpanelProps {
  ActivityFlowId = 'Activity Flow ID',
  ActivityId = 'Activity ID',
  AppletId = 'Applet ID',
  Feature = 'Feature',
  ItemId = 'Item ID',
  ItemTypes = 'Item Types',
  MultiInformantAssessmentId = 'Multi-informant Assessment ID',
  SubmitId = 'Submit ID',
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
  ResponseReportDownloadClicked = 'Response Report Download Clicked',
  ResponseReportGenerated = 'Response Report Generated',
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
  WithAppletId<{
    action: MixpanelEventType.ResponseReportDownloadClicked;
    [MixpanelProps.ItemId]: string;
    [MixpanelProps.ActivityId]?: string;
    [MixpanelProps.ActivityFlowId]?: string;
    [MixpanelProps.ItemTypes]?: ItemResponseTypeDTO[];
  }>
>;

export type ResponseReportGeneratedEvent = WithFeature<
  WithAppletId<{
    action: MixpanelEventType.ResponseReportGenerated;
    [MixpanelProps.ItemId]: string;
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
  | ResponseReportDownloadClickedEvent
  | ResponseReportGeneratedEvent
  | SaveAndExitClickedEvent
  | SignupSuccessfulEvent
  | TransferOwnershipDeclinedEvent
  | LoginScreenCreateAccountBtnClickEvent;
