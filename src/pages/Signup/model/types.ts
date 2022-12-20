import { Authorization, Account, User } from "~/entities/user/model/interface"

export interface ISignupError {
  message: string
  type: string
}

export interface ISignupSuccess extends User {
  account: Account
  authToken: Authorization
}
