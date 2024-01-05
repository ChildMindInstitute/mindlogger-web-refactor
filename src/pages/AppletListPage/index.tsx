import { useEffect } from "react"

import { Mixpanel } from "~/shared/utils"
import { AppletListWidget } from "~/widgets/AppletList"

export const AppletListPage = () => {
  useEffect(() => {
    Mixpanel.trackPageView("Dashboard")
  }, [])

  return <AppletListWidget />
}
