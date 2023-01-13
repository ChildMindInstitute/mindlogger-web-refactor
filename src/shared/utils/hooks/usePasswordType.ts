import { useState } from "react"

type PasswordInputType = "text" | "password"

export const usePasswordType = (): [PasswordInputType, () => void] => {
  const [isPasswordType, setIsPasswordType] = useState<PasswordInputType>("password")

  const onPasswordIconClick = () => {
    if (isPasswordType === "password") {
      setIsPasswordType("text")
    } else {
      setIsPasswordType("password")
    }
  }

  return [isPasswordType, onPasswordIconClick]
}
