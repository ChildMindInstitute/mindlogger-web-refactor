import { clearAuth, setAuth as setAuthToStore, userAuthSelector } from "../state/auth.slice"
import { clearUser, setUser as setUserToStore, userSelector } from "../state/user.slice"
import { Authorization, UserStore } from "../user.schema"

import { useAppDispatch, useAppSelector, isObjectEmpty } from "~/shared/utils"

export interface UseAuthOutput {
  user: UserStore
  auth: Authorization
  isUserLoggedIn: boolean
  setUser: (user: UserStore) => void
  setAuth: (auth: Authorization) => void
  clearUserAndAuth: () => void
}

export const useAuth = (): UseAuthOutput => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(userSelector)
  const auth = useAppSelector(userAuthSelector)

  const isUserLoggedIn = !!auth.accessToken && !isObjectEmpty(user)

  const setUser = (user: UserStore) => {
    dispatch(setUserToStore(user))
  }

  const setAuth = (auth: Authorization) => {
    dispatch(setAuthToStore(auth))
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
    setUser,
    setAuth,
    clearUserAndAuth,
  }
}
