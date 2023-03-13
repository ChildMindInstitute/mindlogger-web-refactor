import { useCallback } from "react"

import { AppletListItem } from "../../lib"
import { actions, AppletState } from "../applet.slice"
import { appletSelector } from "../selectors"

import { useAppDispatch, useAppSelector } from "~/shared/utils"

type UseAppletStateReturn = {
  selectedApplet: AppletState
  saveApplet: (data: AppletListItem) => void
  clearSelectedApplet: () => void
}

export const useAppletState = (): UseAppletStateReturn => {
  const selectedApplet = useAppSelector(appletSelector)

  const dispatch = useAppDispatch()

  const clearSelectedApplet = useCallback(() => {
    return dispatch(actions.clearAppletState())
  }, [dispatch])

  const saveApplet = useCallback(
    (data: AppletListItem) => {
      return dispatch(actions.saveSelectedApplet(data))
    },
    [dispatch],
  )

  return {
    selectedApplet,
    saveApplet,
    clearSelectedApplet,
  }
}
