import { PropsWithChildren } from "react"
import Footer from "../shared/footer"
import Header from "../shared/header"

type LayerProps = PropsWithChildren<unknown>

export const Layer = ({ children }: LayerProps) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
