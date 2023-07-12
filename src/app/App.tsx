import { Suspense } from "react"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import Layout from "./Layout"
import { DateLocalizationProvider, ReactQuery, ReduxProvider, RouteProvider } from "./providers"
import i18nManager from "./system/locale/i18n"

import ApplicationRouter from "~/pages"

import "./index.css"

i18nManager.initialize()

function App() {
  return (
    <Suspense>
      <RouteProvider>
        <ReduxProvider>
          <ReactQuery>
            <DateLocalizationProvider>
              <Layout>
                <ApplicationRouter />
              </Layout>
            </DateLocalizationProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQuery>
        </ReduxProvider>
      </RouteProvider>
    </Suspense>
  )
}

export default App
