import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { IUpdatePasswordPayload } from "../../model/api.interfaces"
import { authorizationService } from "../authorization.service"

import { BaseErrorResponse } from "~/shared/utils"

export type SuccessUpdatePasswordResponse = AxiosResponse<{ message: string }>
export type FailedUpdatePasswordResponse = AxiosError<BaseErrorResponse>

export const useUpdatePasswordMutation = (
  options: MutationOptions<SuccessUpdatePasswordResponse, FailedUpdatePasswordResponse, IUpdatePasswordPayload> = {},
) => {
  const name = "updatePassword"

  return useMutation([name], (data: IUpdatePasswordPayload) => authorizationService.updatePassword(data), options)
}
