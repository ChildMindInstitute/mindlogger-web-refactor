type Status = "ALREADY_ACCEPTED" | "OK"

export interface GetInvitationByIdPayload {
  invitationId: string
}

export interface AcceptInvitationByIdPayload {
  invitationId: string
}

export interface DeclineInvitationByIdPayload {
  invitationId: string
}

export interface GetInvitationSuccessResponse {
  key: string
  email: string
  status: Status
  role: string

  title: string
  body: string

  appletName: string
  appletId: string | number
}
