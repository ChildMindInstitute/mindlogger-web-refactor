import * as z from "zod"
import { Account, Authorization, User } from "~/entities/user/model/interface"

import { LoginSchema } from "./login.schema"

export type TLoginForm = z.infer<typeof LoginSchema>

export interface ILoginSuccessResponse {
  account: Account
  authToken: Authorization
  message: string
  user: User
}

export interface TLoginErrorResponse {
  message: string
  type: string
}
