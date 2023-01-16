import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"

import { BaseErrorResponse, BaseSuccessResponse } from "../../../../shared/utils"
import { User } from "../../model/user.schema"
import { authorizationService } from "../authorization.service"

export type IGetUserSuccessResponse = BaseSuccessResponse<User>

export type SuccessGetUserResponse = AxiosResponse<IGetUserSuccessResponse>
export type FailedGetUserResponse = AxiosError<BaseErrorResponse>

export const useGetUserMutation = (
  options: MutationOptions<SuccessGetUserResponse, FailedGetUserResponse, string> = {},
) => {
  const name = "getUser"

  return useMutation([name], (data: string) => authorizationService.getUser(data), options)
}
