export enum MixpanelProps {
  Feature = 'Feature',
  AppletId = 'Applet ID',
  SubmitId = 'Submit ID',
  ActivityId = 'Activity ID',
  ActivityFlowId = 'Activity Flow ID',
  MultiInformantAssessmentId = 'Multi-informant Assessment ID',
}

export enum MixpanelEventType {
  AppletClick = 'Applet click',
  TransferOwnershipAccepted = 'Transfer Ownership Accepted',
  AssessmentCompleted = 'Assessment completed',
  AssessmentStarted = 'Assessment Started',
  InvitationAccepted = 'Invitation Accepted',
  ActivityRestarted = 'Activity Restart Button Pressed',
  ActivityResumed = 'Activity Resume Button Pressed',
  ReturnToAdminApp = 'Return to Admin App button clicked',
  LoginSuccessful = 'Login Successful',
  LoginBtnClick = 'Login Button click',
  Logout = 'logout',
  SignupSuccessful = 'Signup Successful',
  TransferOwnershipDeclined = 'Transfer Ownership Declined',
  LoginScreenCreateAccountBtnClick = 'Create account button on login screen click',
}

type WithAppletId<T> = T & { [MixpanelProps.AppletId]?: string | null };

export type AppletClickEvent = WithAppletId<{
  action: MixpanelEventType.AppletClick;
}>;

export type TransferOwnershipAcceptedEvent = WithAppletId<{
  action: MixpanelEventType.TransferOwnershipAccepted;
}>;

export type AssessmentCompletedEvent = WithAppletId<{
  action: MixpanelEventType.AssessmentCompleted;
  [MixpanelProps.SubmitId]: string;
  [MixpanelProps.ActivityId]?: string;
  [MixpanelProps.ActivityFlowId]?: string;
  [MixpanelProps.Feature]?: 'Multi-informant';
  [MixpanelProps.MultiInformantAssessmentId]?: string;
}>;

export type AssessmentStartedEvent = WithAppletId<{
  action: MixpanelEventType.AssessmentStarted;
  [MixpanelProps.ActivityId]?: string;
  [MixpanelProps.ActivityFlowId]?: string;
  [MixpanelProps.Feature]?: 'Multi-informant';
  [MixpanelProps.MultiInformantAssessmentId]?: string;
}>;

export type InvitationAcceptedEvent = WithAppletId<{
  action: MixpanelEventType.InvitationAccepted;
}>;

export type ActivityRestartedEvent = WithAppletId<{
  action: MixpanelEventType.ActivityRestarted;
  [MixpanelProps.ActivityId]?: string;
  [MixpanelProps.ActivityFlowId]?: string | null;
}>;

export type ActivityResumedEvent = WithAppletId<{
  action: MixpanelEventType.ActivityResumed;
  [MixpanelProps.ActivityId]?: string;
  [MixpanelProps.ActivityFlowId]?: string | null;
}>;

export type ReturnToAdminAppEvent = WithAppletId<{
  action: MixpanelEventType.ReturnToAdminApp;
  [MixpanelProps.SubmitId]?: string | null;
  [MixpanelProps.ActivityId]?: string;
  [MixpanelProps.ActivityFlowId]?: string;
  [MixpanelProps.Feature]?: 'Multi-informant';
  [MixpanelProps.MultiInformantAssessmentId]?: string;
}>;

export type LoginSuccessfulEvent = {
  action: MixpanelEventType.LoginSuccessful;
};

export type LoginBtnClickEvent = {
  action: MixpanelEventType.LoginBtnClick;
};

export type LogoutEvent = {
  action: MixpanelEventType.Logout;
};

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
  | SignupSuccessfulEvent
  | TransferOwnershipDeclinedEvent
  | LoginScreenCreateAccountBtnClickEvent;
