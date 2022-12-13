export type { TUserSchema, TUserStateSchema, TUserAuthSchema } from "./model/interface"

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
