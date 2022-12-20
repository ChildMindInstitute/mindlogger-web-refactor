import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { BaseErrorResponse } from "~/utils/types/httpResponses"

import { ILoginPayload } from "../../model/api.interfaces"
import { Account, Authorization, User } from "../../model/interface"
import { authorizationService } from "../authorization.service"

export interface ILoginSuccessResponse {
  account: Account
  authToken: Authorization
  message: string
  user: User
}

export type SuccessLoginResponse = AxiosResponse<ILoginSuccessResponse>
export type FailedLoginResponse = AxiosError<BaseErrorResponse>

export const useFetchLogin = (options: MutationOptions<SuccessLoginResponse, FailedLoginResponse, ILoginPayload>) => {
  const name = "login"

  const fetcher = useMutation([name], (data: ILoginPayload) => authorizationService.login(data), options)

  return fetcher
}
