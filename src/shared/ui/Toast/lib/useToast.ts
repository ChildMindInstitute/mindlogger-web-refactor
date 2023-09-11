import { toast } from "react-toastify"

import { Theme } from "~/shared/constants"

export const useToast = () => {
  const showSuccessToast = (text: string) => {
    toast.success(text, {
      style: { backgroundColor: Theme.colors.light.accentGreen, color: Theme.colors.light.inverseOnSurface },
    })
  }

  const showFailedToast = (text: string) => {
    toast.error(text)
  }

  const showWarningToast = (text: string) => {
    toast.warn(text, {
      style: { backgroundColor: Theme.colors.light.accentYellow, color: Theme.colors.light.onSurface },
    })
  }

  return { showSuccessToast, showFailedToast, showWarningToast }
}
