import React from "react"
import "./App.css"
import RootRoutes from "./root-routes"
import ApplicationProvider from "./ApplicationProvider"

function App() {
  return (
    <ApplicationProvider>
      <RootRoutes />
    </ApplicationProvider>
  )
}

export default App
