import { Suspense } from "react"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import Layout from "./Layout"
import { ReactQuery, Redux, RouteProvider } from "./providers"
import i18nManager from "./system/locale/i18n"

import ApplicationRouter from "~/pages"

import "./index.css"

i18nManager.initialize()

function App() {
  return (
    <Suspense>
      <RouteProvider>
        <Redux>
          <ReactQuery>
            <Layout>
              <ApplicationRouter />
            </Layout>
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQuery>
        </Redux>
      </RouteProvider>
    </Suspense>
  )
}

export default App
