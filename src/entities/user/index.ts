export type { User as TUserSchema, TUserStateSchema, Authorization as TUserAuthSchema } from "./model/interface"

export { UserSchema, UserStateSchema, AuthSchema } from "./model/user.schema"
export { default as userReducer, setUser, clearUser } from "./model/user.slice"
export {
  default as authReducer,
  setAuth,
  authToken,
  authTokenExpires,
  authTokenScope,
  authUserSlice,
  clearAuth,
} from "./model/auth.slice"

export { useAuth } from "./lib/useAuth"
export { useFetchAuthorization } from "../../pages/Login/lib/api"
export type { ResponseLoginData } from "../../pages/Login/lib/api"
