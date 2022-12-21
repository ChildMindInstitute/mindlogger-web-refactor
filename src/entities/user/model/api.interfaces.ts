export interface ILoginPayload {
  email: string
  password: string
}

export interface ILogoutPayload {
  token: string
}

export interface ISignupPayload {
  email: string
  lastName: string
  firstName: string
  password: string
}
