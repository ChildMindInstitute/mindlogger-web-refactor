import React, { Suspense } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

interface ReactQueryProps {
  children: React.ReactNode
}

const ReactQuery = (props: ReactQueryProps) => {
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </Suspense>
  )
}

export default ReactQuery
