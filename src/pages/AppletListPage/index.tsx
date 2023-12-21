import { useEffect } from "react"

import { AppletList } from "~/entities/applet"
import { Mixpanel } from "~/shared/utils"

export const AppletListPage = () => {
  useEffect(() => {
    Mixpanel.trackPageView("Dashboard")
  }, [])

  return <AppletList />
}
