import { useAppDispatch, useAppSelector, isObjectEmpty } from "~/shared"

import { clearAuth, setAuth, userAuthSelector } from "../../model/state/auth.slice"
import { clearUser, setUser, userSelector } from "../../model/state/user.slice"
import { Authorization, UserStore } from "../../model/user.schema"

export interface UseAuthOutput {
  user: UserStore
  auth: Authorization
  isUserLoggedIn: boolean
  setUserAndAuth: (user: UserStore, auth: Authorization) => void
  clearUserAndAuth: () => void
}

export const useAuth = (): UseAuthOutput => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(userSelector)
  const auth = useAppSelector(userAuthSelector)

  const isUserLoggedIn = !!auth.token && !isObjectEmpty(user)

  const setUserAndAuth = (user: UserStore, auth: Authorization) => {
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
