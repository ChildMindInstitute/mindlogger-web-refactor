import { Suspense, lazy } from "react"

import CssBaseline from "@mui/material/CssBaseline"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { DateLocalizationProvider, MUIThemeProvider, ReactQuery, ReduxProvider, RouteProvider } from "./providers"
import i18nManager from "./system/locale/i18n"

import Loader from "~/shared/ui/Loader"
import { Mixpanel } from "~/shared/utils"

const ApplicationRouter = lazy(() => import("~/pages"))

import "~/assets/fonts/Atkinson/atkinson.css"

import "./index.css"

Mixpanel.init()
i18nManager.initialize()

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <CssBaseline />
      <MUIThemeProvider>
        <RouteProvider>
          <ReduxProvider>
            <ReactQuery>
              <DateLocalizationProvider>
                <ApplicationRouter />
              </DateLocalizationProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </ReactQuery>
          </ReduxProvider>
        </RouteProvider>
      </MUIThemeProvider>
    </Suspense>
  )
}

export default App
