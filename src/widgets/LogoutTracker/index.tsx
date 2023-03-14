import { PropsWithChildren, useCallback, useEffect } from "react"

import { useLogout } from "~/features/Logout"
import { eventEmitter } from "~/shared/utils"

type LogoutTrackerProps = PropsWithChildren<unknown>

export const LogoutTracker = ({ children }: LogoutTrackerProps) => {
  const { logout } = useLogout()

  const onLogoutEvent = useCallback(() => {
    logout()
  }, [logout])

  useEffect(() => {
    eventEmitter.on("onLogout", onLogoutEvent)

    return () => {
      eventEmitter.off("onLogout", onLogoutEvent)
    }
  }, [onLogoutEvent])

  return children as JSX.Element
}
