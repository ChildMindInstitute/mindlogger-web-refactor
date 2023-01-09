import { PropsWithChildren } from "react"
import { Button, ButtonProps, Spinner } from "react-bootstrap"
import classNames from "classnames"

import "./styles.scss"

type BasicButtonProps = ButtonProps &
  PropsWithChildren<unknown> & {
    loading?: boolean
    defaultSize?: boolean
  }

const BasicButton = ({ children, loading, className, defaultSize, ...rest }: BasicButtonProps) => {
  return (
    <Button {...rest} className={classNames(className, { "default-button-size": defaultSize })}>
      {!loading ? children : <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
    </Button>
  )
}

export default BasicButton
