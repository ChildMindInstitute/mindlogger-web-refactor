import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { BaseErrorResponse, BaseSuccessResponse } from "~/shared/utils"

import { ILoginPayload } from "../../model/api.interfaces"
import { Authorization } from "../../model/user.schema"
import { authorizationService } from "../authorization.service"

export type ILoginSuccessResponse = BaseSuccessResponse<Authorization>

export type SuccessLoginResponse = AxiosResponse<ILoginSuccessResponse>
export type FailedLoginResponse = AxiosError<BaseErrorResponse>

export const useLoginMutation = (
  options: MutationOptions<SuccessLoginResponse, FailedLoginResponse, ILoginPayload> = {},
) => {
  const name = "login"

  return useMutation([name], (data: ILoginPayload) => authorizationService.login(data), options)
}
