import { useCallback } from "react"

import { User } from "../../lib"
import { userSelector } from "../selectors"
import { actions, UserStore } from "../user.slice"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

interface UseUserStateReturn {
  user: UserStore
  setUser: (data: User) => void
  clearUser: () => void
}

export const useUserState = (): UseUserStateReturn => {
  const dispatch = useAppDispatch()

  const user = useAppSelector(userSelector)
  const setUser = useCallback(
    (data: User) => {
      dispatch(actions.save(data))
    },
    [dispatch],
  )

  const clearUser = useCallback(() => {
    dispatch(actions.clear())
  }, [dispatch])

  return { user, setUser, clearUser }
}
