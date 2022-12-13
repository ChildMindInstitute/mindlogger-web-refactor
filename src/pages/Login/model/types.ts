import * as z from "zod"

import { LoginSchema } from "./login.schema"

export type TLoginForm = z.infer<typeof LoginSchema>

export interface ILoginSuccessResponse {
  account: {
    accountId: string
    accountName: string
    applets: Record<string, unknown>
    isDefaultName: boolean
  }
  authToken: {
    expires: Date
    scope: string[]
    token: string
  }
  message: string
  user: {
    admin: boolean
    created: Date
    creatorId: string
    displayName: string
    email: string
    emailVerified: boolean
    firstName: string
    lastName: string
    login: string
    otp: boolean
    public: boolean
    size: number
    status: string
    _accessLevel: number
    _id: string
    _modelType: string
  }
}

export interface TLoginErrorResponse {
  message: string
  type: string
}
