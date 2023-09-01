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
      display="flex"
      flex={1}
      flexDirection="column"
      sx={{
        backgroundColor: bgColor,
      }}>
      {hasHeader && <Header />}
      <Box id="app-content-container" display="flex" flex={1} flexDirection="column" sx={{ overflow: "auto" }}>
        <Box display="flex" flex={1}>
          <Outlet />
        </Box>
        {hasFooter && <Footer />}
      </Box>
    </Box>
  )
}

export default Layout
