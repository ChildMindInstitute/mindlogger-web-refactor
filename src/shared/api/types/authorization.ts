import { BaseSuccessResponse } from './base';

export interface LoginPayload {
  email: string;
  password: string;
}

// Standard login success result (no MFA)
export interface LoginSuccessResult {
  token: AuthorizationDTO;
  user: UserDTO;
}

// MFA required result from login
export interface MFARequiredResult {
  mfaRequired: true;
  mfaToken: string;
  mfaSessionId: string;
  /** User ID - enables immediate private key derivation */
  userId: string;
  /** User email - enables immediate private key derivation */
  userEmail: string;
}

// Login response is a union - either success or MFA required
export type LoginResult = LoginSuccessResult | MFARequiredResult;

export type LoginSuccessResponse = BaseSuccessResponse<LoginResult>;

// MFA TOTP verification payload
export interface MFAVerifyTOTPPayload {
  mfaToken: string;
  totpCode: string;
  deviceId: string | null;
}

// MFA Recovery code verification payload
export interface MFAVerifyRecoveryPayload {
  mfaToken: string;
  code: string;
  deviceId: string | null;
}

// MFA verification success response (same structure as standard login success)
export type MFAVerifySuccessResponse = BaseSuccessResponse<{
  token: AuthorizationDTO;
  user: UserDTO;
}>;

export interface LogoutPayload {
  accessToken: string;
}

export interface SignupPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export type SignupSuccessResponse = BaseSuccessResponse<UserDTO>;

export interface RecoveryPasswordPayload {
  email: string;
}

export type RecoveryPasswordLinkHealthcheckPayload = {
  email: string;
  key: string;
};

export type PasswordRecoverySuccessResponse = BaseSuccessResponse<UserDTO>;

export interface RecoveryPasswordApprovalPayload {
  email: string;
  key: string;
  password: string;
}

export type PasswordRecoveryApprovalSuccessResponse = BaseSuccessResponse<UserDTO>;

export interface UpdatePasswordPayload {
  prev_password: string;
  password: string;
}

export type UpdatePasswordSuccessResponse = BaseSuccessResponse<UserDTO>;

export interface RefreshTokenPayload {
  refreshToken: string;
}

export type RefreshTokenSuccessResponse = BaseSuccessResponse<AuthorizationDTO>;

interface AuthorizationDTO {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
