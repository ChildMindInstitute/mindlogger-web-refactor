import { BaseSuccessResponse } from "./base"

export interface LoginPayload {
  email: string
  password: string
}

export type LoginSuccessResponse = BaseSuccessResponse<{
  auth: AuthorizationDTO
  user: UserDTO
}>

export interface LogoutPayload {
  accessToken: string
}

export interface SignupPayload {
  email: string
  fullName: string
  password: string
}

export type SignupSuccessResponse = BaseSuccessResponse<UserDTO>

export interface RecoveryPasswordPayload {
  email: string
}

export type PasswordRecoverySuccessResponse = BaseSuccessResponse<UserDTO>

export interface RecoveryPasswordApprovalPayload {
  email: string
  key: string
  password: string
}

export type PasswordRecoveryApprovalSuccessResponse = BaseSuccessResponse<UserDTO>

export interface UpdatePasswordPayload {
  oldPassword: string
  password: string
}

export type UpdatePasswordSuccessResponse = BaseSuccessResponse<UserDTO>

interface AuthorizationDTO {
  accessToken: string
  refreshToken: string
  tokenType: string
}

interface UserDTO {
  id: number
  fullName: string
  email: string
}
