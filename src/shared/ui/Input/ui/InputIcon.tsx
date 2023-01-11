import { PropsWithChildren } from "react"

import classNames from "classnames"

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
