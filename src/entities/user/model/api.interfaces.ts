export interface ILoginPayload {
  email: string
  password: string
}

export interface ILogoutPayload {
  token: string
}

export interface ISignupPayload {
  email: string
  fullName: string
  password: string
}

export interface IRecoveryPasswordPayload {
  email: string
}

export interface IRecoveryPasswordApprovePayload {
  email: string
  key: string
  password: string
}

export interface IUpdatePasswordPayload {
  oldPassword: string
  password: string
}
