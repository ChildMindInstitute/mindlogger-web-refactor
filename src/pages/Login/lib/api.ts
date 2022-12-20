import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"
import authorizationService from "~/entities/user/lib/auth.api"

import { TLoginForm } from "../model"
import { ILoginSuccessResponse, TLoginErrorResponse } from "../model/types"

export type ResponseLoginData = AxiosResponse<ILoginSuccessResponse>
export type ResponseError = AxiosError<TLoginErrorResponse>

export const useFetchAuthorization = (options: MutationOptions<ResponseLoginData, ResponseError, TLoginForm>) => {
  const name = "login"

  const fetcher = useMutation(
    [name],
    (data: TLoginForm) => authorizationService.login(data.email, data.password),
    options,
  )

  return fetcher
}

export const useFetchUnauthorization = (options: MutationOptions<any, any, string>) => {
  // Fix types and check with incorrect token
  const name = "logout"

  const fetcher = useMutation([name], (data: string) => authorizationService.logout(data), options)
  return fetcher
}
