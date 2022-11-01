import React from "react"
import "./App.css"
import RootRoutes from "./root-routes"
import ApplicationProvider from "./ApplicationProvider"
import i18nManager from "./i18n.manager"
import { Layer } from "./layout"

i18nManager.initialize()

function App() {
  return (
    <ApplicationProvider>
      <Layer>
        <RootRoutes />
      </Layer>
    </ApplicationProvider>
  )
}

export default App
