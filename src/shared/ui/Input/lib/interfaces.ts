import { HTMLInputTypeAttribute } from "react"

export interface IInputCommonProps {
  type: HTMLInputTypeAttribute
  autoComplete?: string

  name: string
  placeholder?: string
  onChange?: (e: string | number) => void
  className?: string
}
