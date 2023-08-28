import { toast } from "react-toastify"

export const useAnswerSubmittedToast = () => {
  const showToast = (text: string) => {
    toast.success(text)
  }

  return { showToast }
}
