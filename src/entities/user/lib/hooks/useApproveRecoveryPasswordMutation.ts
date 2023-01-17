import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { BaseErrorResponse, BaseSuccessResponse } from "~/shared/utils"

import { IRecoveryPasswordApprovePayload } from "../../model/api.interfaces"
import { Authorization, User } from "../../model/user.schema"
import { authorizationService } from "../authorization.service"

export type IApproveRecoveryPasswordSuccessResponse = BaseSuccessResponse<{
  message: string
  user: User
  authToken: Omit<Authorization, "scope"> & { temporary: boolean }
}>

export type SuccessApproveRecoveryPasswordResponse = AxiosResponse<IApproveRecoveryPasswordSuccessResponse>
export type FailedApproveRecoveryPasswordResponse = AxiosError<BaseErrorResponse & { field: string }>

export const useApproveRecoveryPasswordMutation = (
  options: MutationOptions<
    SuccessApproveRecoveryPasswordResponse,
    FailedApproveRecoveryPasswordResponse,
    IRecoveryPasswordApprovePayload
  > = {},
) => {
  const name = "approveRecoveryPassword"

  return useMutation(
    [name],
    (data: IRecoveryPasswordApprovePayload) => authorizationService.approveRecoveryPassword(data),
    options,
  )
}
