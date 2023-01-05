import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { BaseErrorResponse } from "~/shared/utils"

import { ILoginPayload } from "../../model/api.interfaces"
import { Account, Authorization, User } from "../../model/user.schema"
import { authorizationService } from "../authorization.service"

export interface ILoginSuccessResponse {
  account: Account
  authToken: Authorization
  message: string
  user: User
}

export type SuccessLoginResponse = AxiosResponse<ILoginSuccessResponse>
export type FailedLoginResponse = AxiosError<BaseErrorResponse>

export const useLoginMutation = (
  options: MutationOptions<SuccessLoginResponse, FailedLoginResponse, ILoginPayload> = {},
) => {
  const name = "login"

  return useMutation([name], (data: ILoginPayload) => authorizationService.login(data), options)
}
