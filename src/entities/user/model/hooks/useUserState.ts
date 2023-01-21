import { User } from "../../lib"
import { userSelector } from "../selectors"
import { actions, UserStore } from "../user.slice"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

export const useUserState = (): [UserStore, (data: User) => void] => {
  const dispatch = useAppDispatch()

  const user = useAppSelector(userSelector)
  const setUser = (data: User) => {
    dispatch(actions.save(data))
  }

  return [user, setUser]
}
