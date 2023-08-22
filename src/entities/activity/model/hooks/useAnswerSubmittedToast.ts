import { useEffect } from "react"

import { useLocation } from "react-router-dom"
import { toast } from "react-toastify"

import { useCustomMediaQuery } from "~/shared/utils"

type Props = {
  text: string
}

export const useAnswerSubmittedToast = (props: Props) => {
  const location = useLocation()
  const { greaterThanSM } = useCustomMediaQuery()

  useEffect(() => {
    const isAnswersSubmitted = location.state?.isAnswersSubmitted || false

    if (isAnswersSubmitted) {
      toast.success(props.text, { position: greaterThanSM ? "bottom-left" : "bottom-center" })
      location.state = {}
    }
  }, [greaterThanSM, location, location.state, props.text])
}
