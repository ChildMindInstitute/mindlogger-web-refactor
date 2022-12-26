import { encryptBASE64, httpService, Http } from "~/shared"

import { IForgotPasswordPayload, ILoginPayload, ILogoutPayload, ISignupPayload } from "../model/api.interfaces"

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
}

export const authorizationService = new AuthorizationService(httpService)
