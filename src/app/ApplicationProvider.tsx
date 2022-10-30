import { PropsWithChildren } from "react"

import RouteProvider from "./RouterProvider"
import StoreProvider from "./StoreProvider"

type Props = PropsWithChildren<unknown>

export default function ApplicationProvider({ children }: Props) {
  return (
    <RouteProvider>
      <StoreProvider>{children}</StoreProvider>
    </RouteProvider>
  )
}
