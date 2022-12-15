import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError, AxiosResponse } from "axios"
import api from "~/utils/axios"
import { encryptBASE64 } from "~/utils/encryption/encryptBASE64"

import { TLoginForm } from "../model"
import { ILoginSuccessResponse, TLoginErrorResponse } from "../model/types"

export type ResponseLoginData = AxiosResponse<ILoginSuccessResponse>
export type ResponseError = AxiosError<TLoginErrorResponse>

export const makeLoginRequest = async (data: TLoginForm): Promise<ResponseLoginData> => {
  const encryptedUserInfo = encryptBASE64(`${data.email}:${data.password}`)

  const headers = {
    "Girder-Authorization": `Basic ${encryptedUserInfo}`,
  }

  const response = await api.get("/user/authentication", { headers })
  return response
}

export const makeLogoutRequest = async (token: string) => {
  const headers = {
    "Girder-Token": token,
  }

  const response = await api.delete("/user/authentication", { headers })
  return response
}

export const useFetchAuthorization = (options: MutationOptions<ResponseLoginData, ResponseError, TLoginForm>) => {
  const name = "auth"

  const fetcher = useMutation([name], (data: TLoginForm) => makeLoginRequest(data), options)

  return fetcher
}

export const useFetchUnauthorization = (options: MutationOptions<any, any, string>) => {
  const name = "unauth"

  const fetcher = useMutation([name], (data: string) => makeLogoutRequest(data), options)
  return fetcher
}
