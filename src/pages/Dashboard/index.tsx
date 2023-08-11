import Container from "@mui/material/Container"

import { AppletList } from "~/entities/applet"

export const DashboardPage = () => {
  return (
    <Container id="applet-list-page">
      <AppletList />
    </Container>
  )
}
