import { BaseSuccessResponse } from "./base"

export interface LoginPayload {
  email: string
  password: string
}

export type LoginSuccessResponse = BaseSuccessResponse<{
  token: AuthorizationDTO
  user: UserDTO
}>

export interface LogoutPayload {
  accessToken: string
}

export interface SignupPayload {
  email: string
  firstName: string
  lastName: string
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
  prev_password: string
  password: string
}

export type UpdatePasswordSuccessResponse = BaseSuccessResponse<UserDTO>

export interface RefreshTokenPayload {
  refreshToken: string
}

export type RefreshTokenSuccessResponse = BaseSuccessResponse<AuthorizationDTO>

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
