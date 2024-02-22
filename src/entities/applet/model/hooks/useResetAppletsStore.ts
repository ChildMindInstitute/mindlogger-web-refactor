import { useCallback } from "react"

import { actions } from "../slice"

import { useAppDispatch } from "~/shared/utils"

export const useResetAppletsStore = () => {
  const dispatch = useAppDispatch()

  const resetAppletsStore = useCallback(() => {
    dispatch(actions.resetAppletsStore())
  }, [dispatch])

  return {
    resetAppletsStore,
  }
}
