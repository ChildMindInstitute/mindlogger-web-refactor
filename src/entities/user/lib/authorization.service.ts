import { httpService, Http } from "~/shared/api"
import { encryptBASE64 } from "~/shared/utils"

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
    const encryptedUserInfo = encryptBASE64(`${data.email}:${data.password}`)

    const headers = {
      "Girder-Authorization": `Basic ${encryptedUserInfo}`,
    }

    return this.httpService.GET("/user/authentication", { headers })
  }

  public logout(data: ILogoutPayload) {
    const headers = {
      "Girder-Token": data.token,
    }

    return this.httpService.DELETE("/user/authentication", { headers })
  }

  public signup(user: ISignupPayload) {
    const params = {
      ...user,
      admin: true, // Ask backend why we should set it to true
    }

    return this.httpService.POST("/user", null, { params })
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
