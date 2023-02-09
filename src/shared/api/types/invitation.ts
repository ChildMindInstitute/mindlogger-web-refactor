type Status = "ALREADY_ACCEPTED" | "OK"

export interface GetInvitationSuccessResponse {
  key: string
  email: string
  title: string
  body: string
  status: Status
  appletName: string
}
