import { PropsWithChildren } from "react"

import CssBaseline from "@mui/material/CssBaseline"

import DateLocalizationProvider from "./date-localization-provider"
import ReactQuery from "./react-query"
import ReduxProvider from "./redux"
import RouteProvider from "./route-provider"
import MUIThemeProvider from "./theme-provider"

type Props = PropsWithChildren<unknown>

function Providers({ children }: Props) {
  return (
    <>
      <CssBaseline />
      <MUIThemeProvider>
        <RouteProvider>
          <ReduxProvider>
            <ReactQuery>
              <DateLocalizationProvider>{children}</DateLocalizationProvider>
            </ReactQuery>
          </ReduxProvider>
        </RouteProvider>
      </MUIThemeProvider>
    </>
  )
}

export default Providers
