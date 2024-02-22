type Status = "approved" | "pending" | "declined"

export interface InvitationDetails {
  key: string
  email: string
  status: Status
  role: string

  title: string | null
  body: string | null

  appletName: string
  appletId: string | number
}
