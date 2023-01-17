import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { IRecoveryPasswordPayload } from "../../model/api.interfaces"
import { authorizationService } from "../authorization.service"

import { BaseErrorResponse, BaseSuccessResponse } from "~/shared/utils"

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
