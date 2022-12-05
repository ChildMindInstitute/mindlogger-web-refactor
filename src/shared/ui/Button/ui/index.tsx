import { PropsWithChildren } from "react"
import { Button, ButtonProps } from "react-bootstrap"

type BasicButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps & PropsWithChildren<unknown>

const BasicButton = ({ children, ...rest }: BasicButtonProps) => {
  return <Button {...rest}>{children}</Button>
}

export default BasicButton
