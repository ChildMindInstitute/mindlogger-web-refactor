import { BrowserRouter } from "react-router-dom"

import { PropsWithChildren } from "react"

type Props = PropsWithChildren<unknown>

function RouteProvider({ children }: Props) {
  return <BrowserRouter>{children}</BrowserRouter>
}

export default RouteProvider
