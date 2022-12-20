import { useAppDispatch, useAppSelector } from "~/app/store"
import { isObjectEmpty } from "~/utils/object"

import { clearAuth, setAuth, TAuthUserState, userAuthSelector } from "../../model/auth.slice"
import { TUserStateSchema } from "../../model/interface"
import { clearUser, setUser, userSelector } from "../../model/user.slice"

export interface UseAuthOutput {
  user: TUserStateSchema
  auth: TAuthUserState
  isUserLoggedIn: boolean
  setUserAndAuth: (user: TUserStateSchema, auth: TAuthUserState) => void
  clearUserAndAuth: () => void
}

export const useAuth = (): UseAuthOutput => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(userSelector)
  const auth = useAppSelector(userAuthSelector)

  const isUserLoggedIn = !!auth.token && !isObjectEmpty(user)

  const setUserAndAuth = (user: TUserStateSchema, auth: TAuthUserState) => {
    dispatch(setUser(user))
    dispatch(setAuth(auth))
  }

  const clearUserAndAuth = () => {
    localStorage.clear()
    dispatch(clearUser())
    dispatch(clearAuth())
  }

  return {
    user,
    auth,
    isUserLoggedIn,
    setUserAndAuth,
    clearUserAndAuth,
  }
}
