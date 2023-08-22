import { Suspense } from "react"

import CssBaseline from "@mui/material/CssBaseline"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { DateLocalizationProvider, MUIThemeProvider, ReactQuery, ReduxProvider, RouteProvider } from "./providers"
import i18nManager from "./system/locale/i18n"

import ApplicationRouter from "~/pages"
import { AppToast } from "~/shared/ui"
import "react-toastify/dist/ReactToastify.min.css"
import "./index.css"

i18nManager.initialize()

function App() {
  return (
    <Suspense>
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
        <AppToast position="bottom-left" autoCloseMs={3500} />
      </MUIThemeProvider>
    </Suspense>
  )
}

export default App
