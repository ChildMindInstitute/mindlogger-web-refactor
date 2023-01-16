// Authorization service
export type { AuthorizationService } from "./lib/authorization.service"
export { authorizationService } from "./lib/authorization.service"

// Hooks
export type { UseAuthOutput } from "./lib/hooks/useAuth"
export { useAuth } from "./lib/hooks/useAuth"

export type { ILoginSuccessResponse, SuccessLoginResponse, FailedLoginResponse } from "./lib/hooks/useLoginMutation"
export { useLoginMutation } from "./lib/hooks/useLoginMutation"

export type { SuccessLogoutResponse, FailedLogoutResponse } from "./lib/hooks/useLogoutMutation"
export { useLogoutMutation } from "./lib/hooks/useLogoutMutation"

export type { ISignupSuccess, SuccessSignupResponse, FailedSignupResponse } from "./lib/hooks/useSignupMutation"
export { useSignupMutation } from "./lib/hooks/useSignupMutation"

export type {
  IGetUserSuccessResponse,
  SuccessGetUserResponse,
  FailedGetUserResponse,
} from "./lib/hooks/useGetUserMutation"
export { useGetUserMutation } from "./lib/hooks/useGetUserMutation"

export type {
  IForgotPasswordSuccessResponse,
  SuccessForgotPasswordResponse,
  FailedForgotPasswordResponse,
} from "./lib/hooks/useForgotPasswordMutation"
export { useForgotPasswordMutation } from "./lib/hooks/useForgotPasswordMutation"

export type {
  ICheckTemporaryPasswordSuccessResponse,
  SuccessCheckTemporaryPasswordResponse,
  FailedCheckTemporaryPasswordResponse,
} from "./lib/hooks/useCheckTemporaryPasswordMutation"
export { useCheckTemporaryPasswordMutation } from "./lib/hooks/useCheckTemporaryPasswordMutation"

export type { SuccessUpdatePasswordResponse, FailedUpdatePasswordResponse } from "./lib/hooks/useUpdatePasswordMutation"
export { useUpdatePasswordMutation } from "./lib/hooks/useUpdatePasswordMutation"

// Model
export type { User, UserStore, Authorization, Account } from "./model/user.schema"
export { UserSchema, UserStoreSchema, AuthSchema, UserAccountSchema } from "./model/user.schema"

export type { ILoginPayload, ILogoutPayload, ISignupPayload } from "./model/api.interfaces"

// Store
export { default as userReducer, setUser, clearUser, userSelector } from "./model/state/user.slice"
export {
  default as authReducer,
  setAuth,
  clearAuth,
  userAuthSelector,
  authToken,
  authTokenType as authTokenExpires,
  authRefreshToken as authTokenScope,
} from "./model/state/auth.slice"
