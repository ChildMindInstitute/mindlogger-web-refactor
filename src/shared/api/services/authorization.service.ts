import axiosService from './axios';
import {
  LoginPayload,
  LoginSuccessResponse,
  LogoutPayload,
  PasswordRecoveryApprovalSuccessResponse,
  PasswordRecoverySuccessResponse,
  RecoveryPasswordApprovalPayload,
  RecoveryPasswordLinkHealthcheckPayload,
  RecoveryPasswordPayload,
  RefreshTokenPayload,
  RefreshTokenSuccessResponse,
  SignupPayload,
  SignupSuccessResponse,
  UpdatePasswordPayload,
  UpdatePasswordSuccessResponse,
} from '../types';

function authorizationService() {
  return {
    login(data: LoginPayload) {
      return axiosService.post<LoginSuccessResponse>('/auth/login', data);
    },

    logout(data: LogoutPayload) {
      const headers = {
        Authorization: `Bearer ${data.accessToken}`,
      };

      const body = {
        deviceId: null,
      };

      return axiosService.post('/auth/logout', body, { headers });
    },

    signup(data: SignupPayload) {
      return axiosService.post<SignupSuccessResponse>('/users', data);
    },

    recoveryPassword(data: RecoveryPasswordPayload) {
      return axiosService.post<PasswordRecoverySuccessResponse>(`/users/me/password/recover`, data);
    },
    recoveryLinkHealthCheck(params: RecoveryPasswordLinkHealthcheckPayload) {
      return axiosService.get(`/users/me/password/recover/healthcheck`, {
        params,
      });
    },

    approveRecoveryPassword(data: RecoveryPasswordApprovalPayload) {
      return axiosService.post<PasswordRecoveryApprovalSuccessResponse>(`/users/me/password/recover/approve`, data);
    },

    updatePassword(data: UpdatePasswordPayload) {
      return axiosService.put<UpdatePasswordSuccessResponse>('/users/me/password', data);
    },
    refreshToken(data: RefreshTokenPayload) {
      return axiosService.post<RefreshTokenSuccessResponse>('/auth/token/refresh', data);
    },
  };
}

export default authorizationService();
