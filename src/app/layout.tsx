import { ReactNode } from "react"

import Header from "../widgets/header"

interface LayoutProps {
  children: ReactNode
}

const Layout = (props: LayoutProps): null | JSX.Element => {
  return (
    <>
      <Header />
      <div className="content-container">{props.children}</div>
    </>
  )
}

export default Layout
