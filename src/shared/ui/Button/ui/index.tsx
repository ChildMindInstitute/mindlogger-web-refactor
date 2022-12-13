import { PropsWithChildren } from "react"
import { Button, ButtonProps, Spinner } from "react-bootstrap"

type BasicButtonProps = ButtonProps &
  PropsWithChildren<unknown> & {
    loading?: boolean
  }

const BasicButton = ({ children, loading, ...rest }: BasicButtonProps) => {
  return (
    <Button {...rest}>
      {!loading ? children : <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
    </Button>
  )
}

export default BasicButton
