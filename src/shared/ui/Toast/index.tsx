import { ToastContainer } from "react-toastify"

import { Theme } from "~/shared/constants"
import { useCustomMediaQuery } from "~/shared/utils"

import "./style.scss"

type Props = {
  autoCloseMs: number
  hideProgressBar?: boolean
  newestOnTop?: boolean
  closeOnClick?: boolean
  pauseOnFocusLoss?: boolean
  pauseOnHover?: boolean
}

export const AppToast = (props: Props) => {
  const { greaterThanSM } = useCustomMediaQuery()

  return (
    <ToastContainer
      autoClose={props.autoCloseMs}
      hideProgressBar={props.hideProgressBar || false}
      newestOnTop={props.newestOnTop || false}
      closeOnClick={props.closeOnClick || true}
      rtl={false}
      pauseOnFocusLoss={props.pauseOnFocusLoss || true}
      draggable
      pauseOnHover={props.pauseOnHover || true}
      theme="colored"
      toastStyle={{
        backgroundColor: Theme.colors.light.accentGreen,
        color: Theme.colors.light.inverseOnSurface,
        width: greaterThanSM ? "400px" : "300px",
      }}
    />
  )
}
