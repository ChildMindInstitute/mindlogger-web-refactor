import { PropsWithChildren } from "react"

import classNames from "classnames"

import "./style.scss"

type DisableOverlayProps = PropsWithChildren & {
  message: string
  isDisabled: boolean
  className?: string
}

export const DisableOverlay = ({ message, isDisabled, children, className }: DisableOverlayProps) => {
  return (
    <div className={classNames({ "disable-overlay-wrapper": isDisabled }, className)}>
      {isDisabled && (
        <div className={classNames({ "disable-overlay-message-wrapper": isDisabled })}>
          <div className={classNames({ "disable-overlay-message": isDisabled })}>{message}</div>
        </div>
      )}

      {isDisabled && <div className={classNames({ "overlay-blur": isDisabled })}></div>}

      {children}
    </div>
  )
}
