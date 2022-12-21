import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { authorizationService } from "~/entities/user/lib/authorization.service"
import { BaseErrorResponse } from "~/utils/types/httpResponses"

import { ILogoutPayload } from "../../model/api.interfaces"

export type SuccessLogoutResponse = AxiosResponse<{ message: string }>
export type FailedLogoutResponse = AxiosError<BaseErrorResponse>

export const useLogoutMutation = (
  options: MutationOptions<SuccessLogoutResponse, FailedLogoutResponse, ILogoutPayload> = {},
) => {
  const name = "logout"

  return useMutation([name], (data: ILogoutPayload) => authorizationService.logout(data), options)
}
