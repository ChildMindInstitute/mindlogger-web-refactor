import { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

const Layout = (props: LayoutProps): null | JSX.Element => {
  return (
    <>
      <div> Some header</div>
      <div>{props.children}</div>
      <div>Some footer</div>
    </>
  )
}

export default Layout
