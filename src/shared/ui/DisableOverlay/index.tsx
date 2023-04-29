import { PropsWithChildren } from "react"

import classNames from "classnames"
import { Container } from "react-bootstrap"

import "./style.scss"

type DisableOverlayProps = PropsWithChildren & {
  message: string
  isDisabled: boolean
}

export const DisableOverlay = ({ message, isDisabled, children }: DisableOverlayProps) => {
  return (
    <Container className={classNames({ "disable-overlay-wrapper": isDisabled })}>
      {isDisabled && (
        <div className={classNames({ "disable-overlay-message-wrapper": isDisabled })}>
          <div className={classNames({ "disable-overlay-message": isDisabled })}>{message}</div>
        </div>
      )}

      <Container className={classNames({ "overlay-blur": isDisabled })}>{children}</Container>
    </Container>
  )
}
