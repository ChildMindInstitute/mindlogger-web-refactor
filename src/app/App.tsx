import { Suspense } from "react"

import i18nManager from "./system/locale/i18n"

import { ReactQuery, Redux, RouteProvider } from "./providers"

import ApplicationRouter from "./routes"
import Layout from "./Layout"

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
          </ReactQuery>
        </Redux>
      </RouteProvider>
    </Suspense>
  )
}

export default App
