import { AxiosError, AxiosResponse } from "axios"
import { MutationOptions, useMutation } from "@tanstack/react-query"

import authorizationService from "~/entities/user/lib/auth.api"
import { TSignupForm } from "../model/signup.schema"
import { ISignupError, ISignupSuccess } from "../model/types"

export type TSignupResponseSuccess = AxiosResponse<ISignupSuccess>
export type TSignupResponseError = AxiosError<ISignupError>

export const useFetchSignup = (options: MutationOptions<TSignupResponseSuccess, TSignupResponseError, TSignupForm>) => {
  const name = "signup"

  const fetcher = useMutation([name], (data: TSignupForm) => authorizationService.signup(data), options)

  return fetcher
}
