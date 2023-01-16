import { AxiosError, AxiosResponse } from "axios"
import { MutationOptions, useMutation } from "@tanstack/react-query"

import { BaseErrorResponse, BaseSuccessResponse } from "~/shared/utils"

import { ISignupPayload } from "../../model/api.interfaces"
import { User } from "../../model/user.schema"
import { authorizationService } from "../authorization.service"

export type ISignupSuccess = BaseSuccessResponse<User>

export type SuccessSignupResponse = AxiosResponse<ISignupSuccess>
export type FailedSignupResponse = AxiosError<BaseErrorResponse>

export const useSignupMutation = (
  options: MutationOptions<SuccessSignupResponse, FailedSignupResponse, ISignupPayload> = {},
) => {
  const name = "signup"

  return useMutation([name], (data: ISignupPayload) => authorizationService.signup(data), options)
}
