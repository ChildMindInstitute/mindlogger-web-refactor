// Authorization service
export type { AuthorizationService } from "./lib/authorization.service"
export { authorizationService } from "./lib/authorization.service"

// Hooks
export type { UseAuthOutput } from "./lib/hooks/useAuth"
export { useAuth } from "./lib/hooks/useAuth"

export type { ILoginSuccessResponse, SuccessLoginResponse, FailedLoginResponse } from "./lib/hooks/useFetchLogin"
export { useLoginMutation } from "./lib/hooks/useFetchLogin"

export type { SuccessLogoutResponse, FailedLogoutResponse } from "./lib/hooks/useFetchLogout"
export { useLogoutMutation } from "./lib/hooks/useFetchLogout"

export type { ISignupSuccess, SuccessSignupResponse, FailedSignupResponse } from "./lib/hooks/useFetchSignup"
export { useSignupMutation } from "./lib/hooks/useFetchSignup"

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
  authTokenExpires,
  authTokenScope,
} from "./model/state/auth.slice"
