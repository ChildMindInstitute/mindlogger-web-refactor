import { ToastContainer } from "react-toastify"

import { useCustomMediaQuery } from "~/shared/utils"

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
      position="bottom-left"
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
        width: greaterThanSM ? "400px" : "100%",
      }}
    />
  )
}
