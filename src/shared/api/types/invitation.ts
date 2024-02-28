import { BaseSuccessResponse } from './base';

type Status = 'approved' | 'pending' | 'declined';

export interface GetInvitationByIdPayload {
  invitationId: string;
}

export interface AcceptInvitationByIdPayload {
  invitationId: string;
}

export interface DeclineInvitationByIdPayload {
  invitationId: string;
}

export interface TransferOwnershipPayload {
  appletId: string;
  key: string;
}

export type GetInvitationSuccessResponse = BaseSuccessResponse<{
  key: string;
  email: string;
  status: Status;
  role: string;

  title: string | null;
  body: string | null;

  appletName: string;
  appletId: string;
}>;
