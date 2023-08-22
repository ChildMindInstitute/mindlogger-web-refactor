import { ToastContainer } from "react-toastify"

import { Theme } from "~/shared/constants"

type Props = {
  position: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left"
  autoCloseMs: number
  hideProgressBar?: boolean
  newestOnTop?: boolean
  closeOnClick?: boolean
  pauseOnFocusLoss?: boolean
  pauseOnHover?: boolean
}

export const AppToast = (props: Props) => {
  return (
    <ToastContainer
      position={props.position}
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
        width: "400px",
      }}
    />
  )
}
