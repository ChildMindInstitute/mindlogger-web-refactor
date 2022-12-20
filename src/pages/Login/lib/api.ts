import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"
import api from "~/utils/axios"
import { encryptBASE64 } from "~/utils/encryption/encryptBASE64"

import { TLoginForm } from "../model"
import { ILoginSuccessResponse, TLoginErrorResponse } from "../model/types"

export type ResponseData = AxiosResponse<ILoginSuccessResponse>
export type ResponseError = AxiosError<TLoginErrorResponse>

export const makeRequest = async (data: TLoginForm): Promise<ResponseData> => {
  const encryptedUserInfo = encryptBASE64(`${data.email}:${data.password}`)

  const headers = {
    "Girder-Authorization": `Basic ${encryptedUserInfo}`,
  }

  const response = await api.get("/user/authentication", { headers })
  return response
}

export const useFetchAuthorization = (options: MutationOptions<ResponseData, ResponseError, TLoginForm>) => {
  const name = "auth"

  const fetcher = useMutation([name], (data: TLoginForm) => makeRequest(data), options)

  return fetcher
}
