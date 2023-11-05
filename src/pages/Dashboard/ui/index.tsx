import { useEffect } from "react"

import { Container } from "react-bootstrap"

import { AppletList } from "~/entities/applet"
import { Mixpanel } from "~/shared/utils"

const DashboardPage = () => {
  useEffect(() => {
    Mixpanel.trackPageView("Dashboard")
  }, [])

  return (
    <Container>
      <AppletList />
    </Container>
  )
}

export default DashboardPage
