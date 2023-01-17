import {
  IRecoveryPasswordApprovePayload,
  IRecoveryPasswordPayload,
  ILoginPayload,
  ILogoutPayload,
  ISignupPayload,
  IUpdatePasswordPayload,
} from "../model/api.interfaces"

import { httpService, Http } from "~/shared/api"

export class AuthorizationService {
  constructor(private httpService: Http) {}

  // Migrated to the new API
  public login(data: ILoginPayload) {
    return this.httpService.POST("/auth/token", data)
  }

  // Migrated to the new API
  public refreshToken(refreshToken: string) {
    return this.httpService.POST("auth/token/refresh", { refreshToken })
  }

  // Migrated to the new API
  public logout({ token }: ILogoutPayload) {
    const headers = {
      Authorization: `Bearer ${token}`,
    }

    return this.httpService.DELETE("/auth/token", { headers })
  }

  // Migrated to the new API
  public signup(user: ISignupPayload) {
    const body = {
      ...user,
    }

    return this.httpService.POST("/users", body)
  }

  // Migrated to the new API
  public recoveryPassword(data: IRecoveryPasswordPayload) {
    return this.httpService.POST(`/users/me/password/recover`, data)
  }

  // Migrated to the new API
  public approveRecoveryPassword(data: IRecoveryPasswordApprovePayload) {
    return this.httpService.POST(`/users/me/password/recover/approve`, data)
  }

  // Migrated to the new API
  public updatePassword(data: IUpdatePasswordPayload) {
    return this.httpService.PUT("/users/me/password", data)
  }

  // Migrated to the new API
  public getUser(accessToken: string) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }

    return this.httpService.GET("/users/me", { headers })
  }
}

export const authorizationService = new AuthorizationService(httpService)
