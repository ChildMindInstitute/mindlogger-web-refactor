import { ReactNode } from "react"
import { useLocation } from "react-router-dom"

import Footer from "../widgets/Footer"
import Header from "../widgets/Header"

interface LayoutProps {
  children: ReactNode
}

const Layout = (props: LayoutProps): null | JSX.Element => {
  const location = useLocation() // TODO: remove it - just for initial steps of development

  return (
    <>
      <Header />
      <div>{props.children}</div>
      <div>Some footer: location - {location.pathname}</div>
      <Footer />
    </>
  )
}

export default Layout
