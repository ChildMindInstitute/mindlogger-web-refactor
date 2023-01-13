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

export interface IForgotPasswordPayload {
  email: string
}

export interface ICheckTemporaryPasswordPayload {
  userId: string
  temporaryToken: string
}

export interface IUpdatePasswordPayload {
  token: string
  old: string
  new: string
}
