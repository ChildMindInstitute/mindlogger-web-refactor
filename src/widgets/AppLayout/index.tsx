import Box from "@mui/material/Box"
import { Outlet } from "react-router-dom"

import { Theme } from "~/shared/constants"
import Footer from "~/widgets/Footer"
import Header from "~/widgets/Header"

interface LayoutProps {
  bgColor?: string
  hasHeader?: boolean
  hasFooter?: boolean
}

const Layout = ({
  bgColor = Theme.colors.light.surface1,
  hasFooter = true,
  hasHeader = true,
}: LayoutProps): null | JSX.Element => {
  return (
    <Box
      id="app-main-layout"
      height="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        backgroundColor: bgColor,
      }}>
      {hasHeader && <Header />}
      <div className="content-container">
        <div className="content">
          <Outlet />
        </div>
      </div>
      {hasFooter && <Footer />}
    </Box>
  )
}

export default Layout
