import { AxiosError, AxiosResponse } from "axios"
import { MutationOptions, useMutation } from "@tanstack/react-query"

import { BaseErrorResponse } from "~/utils/types/httpResponses"
import { authorizationService } from "~/entities/user/lib/authorization.service"

import { ISignupPayload } from "../../model/api.interfaces"
import { User, Account, Authorization } from "../../model/user.schema"

export interface ISignupSuccess extends User {
  account: Account
  authToken: Authorization
}

export type SuccessSignupResponse = AxiosResponse<ISignupSuccess>
export type FailedSignupResponse = AxiosError<BaseErrorResponse>

export const useFetchSignup = (
  options: MutationOptions<SuccessSignupResponse, FailedSignupResponse, ISignupPayload> = {},
) => {
  const name = "signup"

  const fetcher = useMutation([name], (data: ISignupPayload) => authorizationService.signup(data), options)

  return fetcher
}
