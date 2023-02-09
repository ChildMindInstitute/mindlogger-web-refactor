type Status = "ALREADY_ACCEPTED" | "OK"

export interface InvitationDetails {
  key: string
  email: string
  title: string
  body: string
  status: Status
}
