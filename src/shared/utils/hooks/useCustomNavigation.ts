import { NavigateFunction, useLocation, useNavigate } from "react-router-dom"

type UseCustomNavigationReturn = {
  navigate: NavigateFunction
  goBack: () => void
  canGoBack: boolean
}

export const useCustomNavigation = (): UseCustomNavigationReturn => {
  const navigate = useNavigate()
  const location = useLocation()

  const canGoBack = location.key !== "default"

  const goBack = () => {
    console.log(location)
    console.log(location.key, canGoBack)
    // if (canGoBack) {
    return navigate(-1)
    // }
  }

  return {
    navigate,
    goBack,
    canGoBack,
  }
}
