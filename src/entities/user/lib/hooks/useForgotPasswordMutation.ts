import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { IForgotPasswordPayload } from "../../model/api.interfaces"
import { authorizationService } from "./../authorization.service"

import { BaseErrorResponse } from "~/shared/utils"

export interface IForgotPasswordSuccessResponse {
  message: string
}

export type SuccessForgotPasswordResponse = AxiosResponse<IForgotPasswordSuccessResponse>
export type FailedForgotPasswordResponse = AxiosError<BaseErrorResponse>

export const useForgotPasswordMutation = (
  options: MutationOptions<SuccessForgotPasswordResponse, FailedForgotPasswordResponse, IForgotPasswordPayload> = {},
) => {
  const name = "forgotPassword"

  return useMutation([name], (data: IForgotPasswordPayload) => authorizationService.forgotPassword(data), options)
}
