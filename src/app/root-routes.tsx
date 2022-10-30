import { Route, Routes, useLocation } from "react-router-dom"

const RootRoutes = () => {
  const location = useLocation()

  return (
    <Routes location={location}>
      <Route path="/" element={<div>/</div>} />

      <Route path="/home" element={<div>home</div>} />
    </Routes>
  )
}

export default RootRoutes
