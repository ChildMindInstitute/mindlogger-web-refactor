import React from "react"
import "./App.css"
import RootRoutes from "./root-routes"
import ApplicationProvider from "./ApplicationProvider"
import i18nManager from "./i18n.manager"

i18nManager.initialize()

function App() {
  return (
    <ApplicationProvider>
      <RootRoutes />
    </ApplicationProvider>
  )
}

export default App
