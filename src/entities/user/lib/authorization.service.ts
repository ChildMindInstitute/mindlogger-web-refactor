import { httpService, Http } from "~/shared/api"

import {
  ICheckTemporaryPasswordPayload,
  IForgotPasswordPayload,
  ILoginPayload,
  ILogoutPayload,
  ISignupPayload,
  IUpdatePasswordPayload,
} from "../model/api.interfaces"

export class AuthorizationService {
  constructor(private httpService: Http) {}

  public login(data: ILoginPayload) {
    return this.httpService.POST("/auth/token", data)
  }

  public refreshToken(refreshToken: string) {
    return this.httpService.POST("auth/token/refresh", { refreshToken })
  }

  public logout(data: ILogoutPayload) {
    const headers = {
      "Girder-Token": data.token,
    }

    return this.httpService.DELETE("/user/authentication", { headers })
  }

  public signup(user: ISignupPayload) {
    const body = {
      ...user,
    }

    return this.httpService.POST("/users", body)
  }

  public forgotPassword(data: IForgotPasswordPayload) {
    const query = new URLSearchParams(data as unknown as Record<string, string>).toString()

    return this.httpService.PUT(`/user/password/temporary?${query}`)
  }

  public checkTemporaryPassword(data: ICheckTemporaryPasswordPayload) {
    const params = {
      token: data.temporaryToken,
    }

    return this.httpService.GET(`/user/password/temporary/${data.userId}`, { params })
  }

  public updatePassword({ token, ...rest }: IUpdatePasswordPayload) {
    const headers = { "Girder-Token": token }
    const params = { ...rest }

    return this.httpService.PUT("/user/password", null, { headers, params })
  }
}

export const authorizationService = new AuthorizationService(httpService)
