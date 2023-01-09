import classNames from "classnames"
import { PropsWithChildren } from "react"

interface InputIconProps extends PropsWithChildren {
  onClick: () => void
}

export const InputIcon = ({ children, onClick }: InputIconProps) => {
  return (
    <button type="button" className={classNames("disable-default-style", "input-icon")} onClick={onClick}>
      <div>{children}</div>
    </button>
  )
}
