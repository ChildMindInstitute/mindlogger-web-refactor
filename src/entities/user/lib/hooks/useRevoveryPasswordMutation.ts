import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { BaseErrorResponse, BaseSuccessResponse } from "~/shared/utils"

import { authorizationService } from "../authorization.service"
import { IRecoveryPasswordPayload } from "../../model/api.interfaces"

export type IRecoveryPasswordSuccessResponse = BaseSuccessResponse<{
  message: string
}>

export type SuccessRecoveryPasswordResponse = AxiosResponse<IRecoveryPasswordSuccessResponse>
export type FailedRecoveryPasswordResponse = AxiosError<BaseErrorResponse>

export const useRecoveryPasswordMutation = (
  options: MutationOptions<
    SuccessRecoveryPasswordResponse,
    FailedRecoveryPasswordResponse,
    IRecoveryPasswordPayload
  > = {},
) => {
  const name = "recoveryPassword"

  return useMutation([name], (data: IRecoveryPasswordPayload) => authorizationService.recoveryPassword(data), options)
}
