import { ReactNode } from "react"

import Box from "@mui/material/Box"

import { Theme } from "~/shared/constants"
import Footer from "~/widgets/Footer"
import Header from "~/widgets/Header"

interface LayoutProps {
  children: ReactNode
}

const Layout = (props: LayoutProps): null | JSX.Element => {
  return (
    <Box
      id="app-main-layout"
      height="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        backgroundColor: Theme.colors.light.surface1,
      }}>
      <Header />
      <div className="content-container">
        <div className="content">{props.children}</div>
      </div>
      <Footer />
    </Box>
  )
}

export default Layout
