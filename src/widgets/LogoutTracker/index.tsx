import { PropsWithChildren, useEffect } from "react"

import { useLogout } from "~/features/Logout"
import { eventEmitter } from "~/shared/utils"

type LogoutTrackerProps = PropsWithChildren<unknown>

export const LogoutTracker = ({ children }: LogoutTrackerProps) => {
  const { logout } = useLogout()

  useEffect(() => {
    eventEmitter.on("onLogout", logout)

    return () => {
      eventEmitter.off("onLogout", logout)
    }
  }, [logout])

  return children as JSX.Element
}
