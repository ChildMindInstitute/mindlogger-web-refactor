import { ReactNode } from "react"

import Box from "@mui/material/Box"
import { matchPath, useLocation } from "react-router-dom"

import { Theme } from "~/shared/constants"
import { ROUTES } from "~/shared/utils"
import Footer from "~/widgets/Footer"
import Header from "~/widgets/Header"

interface LayoutProps {
  children: ReactNode
}

const Layout = (props: LayoutProps): null | JSX.Element => {
  const location = useLocation()
  const routeList = Object.values(ROUTES)

  const currentRoute = routeList.find(route => matchPath(route.path, location.pathname))

  return (
    <Box
      id="app-main-layout"
      height="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        backgroundColor: currentRoute?.pageStyles?.backgroundColor ?? Theme.colors.light.surface1,
      }}>
      {currentRoute?.hasHeader && <Header />}
      <div className="content-container">
        <div className="content">{props.children}</div>
      </div>
      {currentRoute?.hasFooter && <Footer />}
    </Box>
  )
}

export default Layout
