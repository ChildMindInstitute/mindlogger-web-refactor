import { ReactNode } from "react"

import Footer from "../widgets/Footer"
import Header from "../widgets/Header"

interface LayoutProps {
  children: ReactNode
}

const Layout = (props: LayoutProps): null | JSX.Element => {
  return (
    <>
      <Header />
      <div className="content-container">{props.children}</div>
      <Footer />
    </>
  )
}

export default Layout
