export type { TUserSchema, TUserStateSchema, TUserAuthSchema } from "./model/interface"

export { UserSchema, UserStateSchema, AuthSchema } from "./model/user.schema"
export { default as userReducer, setUser } from "./model/user.slice"
export {
  default as authReducer,
  setAuth,
  authToken,
  authTokenExpires,
  authTokenScope,
  authUserSlice,
} from "./model/auth.slice"
