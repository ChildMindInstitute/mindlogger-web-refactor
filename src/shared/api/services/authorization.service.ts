import {
  LoginPayload,
  LoginSuccessResponse,
  LogoutPayload,
  PasswordRecoveryApprovalSuccessResponse,
  PasswordRecoverySuccessResponse,
  RecoveryPasswordApprovalPayload,
  RecoveryPasswordPayload,
  SignupPayload,
  SignupSuccessResponse,
  UpdatePasswordPayload,
  UpdatePasswordSuccessResponse,
} from "../types"
import axiosService from "./axios"

function authorizationService() {
  return {
    login(data: LoginPayload) {
      return axiosService.post<LoginSuccessResponse>("/auth/token", data)
    },

    logout(data: LogoutPayload) {
      const headers = {
        Authorization: `Bearer ${data.accessToken}`,
      }
      return axiosService.delete("/auth/token", { headers })
    },

    signup(data: SignupPayload) {
      return axiosService.post<SignupSuccessResponse>("/users", data)
    },

    recoveryPassword(data: RecoveryPasswordPayload) {
      return axiosService.post<PasswordRecoverySuccessResponse>(`/users/me/password/recover`, data)
    },

    approveRecoveryPassword(data: RecoveryPasswordApprovalPayload) {
      return axiosService.post<PasswordRecoveryApprovalSuccessResponse>(`/users/me/password/recover/approve`, data)
    },

    updatePassword(data: UpdatePasswordPayload) {
      return axiosService.put<UpdatePasswordSuccessResponse>("/users/me/password", data)
    },
  }
}

export default authorizationService()
