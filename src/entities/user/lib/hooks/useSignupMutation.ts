import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { ISignupPayload } from "../../model/api.interfaces"
import { User, Account, Authorization } from "../../model/user.schema"
import { authorizationService } from "../authorization.service"

import { BaseErrorResponse } from "~/shared/utils"

export interface ISignupSuccess extends User {
  account: Account
  authToken: Authorization
}

export type SuccessSignupResponse = AxiosResponse<ISignupSuccess>
export type FailedSignupResponse = AxiosError<BaseErrorResponse>

export const useSignupMutation = (
  options: MutationOptions<SuccessSignupResponse, FailedSignupResponse, ISignupPayload> = {},
) => {
  const name = "signup"

  return useMutation([name], (data: ISignupPayload) => authorizationService.signup(data), options)
}
