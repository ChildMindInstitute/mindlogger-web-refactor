import { ReactNode } from "react"

import { BrowserRouter } from "react-router-dom"

interface RouteProviderProps {
  children: ReactNode
}

const RouteProvider = ({ children }: RouteProviderProps) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

export default RouteProvider
