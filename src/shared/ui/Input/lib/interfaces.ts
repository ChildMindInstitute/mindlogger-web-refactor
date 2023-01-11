import { HTMLInputTypeAttribute } from "react"

import { Icon } from "react-bootstrap-icons"

export interface IInputCommonProps {
  type: HTMLInputTypeAttribute
  autoComplete?: string

  name: string
  placeholder?: string
  onChange?: (e: string | number) => void
  className?: string

  Icon?: Icon
  onIconClick?: () => void
}
