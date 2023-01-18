// Model
export type { User, UserStore, Authorization, Account } from "./user.schema"
export { UserSchema, UserStoreSchema, AuthSchema, UserAccountSchema } from "./user.schema"

export type { ILoginPayload, ILogoutPayload, ISignupPayload } from "./api.interfaces"

// Store
export { default as userReducer, setUser, clearUser, userSelector } from "./state/user.slice"
export {
  default as authReducer,
  setAuth,
  clearAuth,
  userAuthSelector,
  authToken,
  authTokenType as authTokenExpires,
  authRefreshToken as authTokenScope,
} from "./state/auth.slice"
