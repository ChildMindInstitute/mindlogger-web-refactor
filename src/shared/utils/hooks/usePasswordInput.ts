import { useMemo, useState } from "react"

import { Eye, EyeSlash, Icon } from "react-bootstrap-icons"

type PasswordInputType = "text" | "password"

export const usePasswordInput = (): [PasswordInputType, () => void, Icon] => {
  const [isPasswordType, setIsPasswordType] = useState<PasswordInputType>("password")

  const PasswordIcon = useMemo(() => {
    if (isPasswordType === "password") {
      return EyeSlash
    } else {
      return Eye
    }
  }, [isPasswordType])

  const onPasswordIconClick = () => {
    if (isPasswordType === "password") {
      setIsPasswordType("text")
    } else {
      setIsPasswordType("password")
    }
  }

  return [isPasswordType, onPasswordIconClick, PasswordIcon]
}
