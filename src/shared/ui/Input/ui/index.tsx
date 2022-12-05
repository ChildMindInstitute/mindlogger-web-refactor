import { Form, FormControlProps } from "react-bootstrap"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & Pick<FormControlProps, "size" | "value">

const Input = (props: InputProps) => {
  return <Form.Control {...props} />
}

export default Input
