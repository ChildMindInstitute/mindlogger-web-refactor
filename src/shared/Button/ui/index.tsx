import { ReactNode } from "react"
import { Button, ButtonProps } from "react-bootstrap"

interface BasicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonProps {
  children: ReactNode
}

const BasicButton = ({ children, ...rest }: BasicButtonProps) => {
  return <Button {...rest}>{children}</Button>
}

export default BasicButton
