import { toast } from "react-toastify"

export const useToast = () => {
  const showToast = (text: string) => {
    toast.success(text)
  }

  return { showToast }
}
