import { useEffect } from "react"

import { useLocation } from "react-router-dom"
import { toast } from "react-toastify"

type Props = {
  text: string
}

export const useAnswerSubmittedToast = (props: Props) => {
  const location = useLocation()

  useEffect(() => {
    const isAnswersSubmitted = location.state?.isAnswersSubmitted || false

    if (isAnswersSubmitted) {
      toast.success(props.text)
      location.state = {}
    }
  }, [location, location.state, props.text])
}
