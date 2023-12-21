import { Suspense } from "react"

import CssBaseline from "@mui/material/CssBaseline"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { DateLocalizationProvider, MUIThemeProvider, ReactQuery, ReduxProvider, RouteProvider } from "./providers"
import i18nManager from "./system/locale/i18n"

import ApplicationRouter from "~/pages"
import Loader from "~/shared/ui/Loader"

import "~/assets/fonts/Atkinson/atkinson.css"

import "./index.css"

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
