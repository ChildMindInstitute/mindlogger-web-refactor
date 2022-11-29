import { ReactNode } from "react"

import { Footer, Header } from "../widgets"

interface LayoutProps {
  children: ReactNode
}

const Layout = (props: LayoutProps): null | JSX.Element => {
  return (
    <>
      <Header />
      <div className="content-container">
        <div className="content">{props.children}</div>
      </div>
      <Footer />
    </>
  )
}

export default Layout
