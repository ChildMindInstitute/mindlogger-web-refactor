import { Container, Form } from "react-bootstrap"

export type BasicFormProps = React.FormHTMLAttributes<HTMLFormElement>

const BasicForm = ({ children, ...rest }: BasicFormProps) => {
  return (
    <Form {...rest}>
      <Container fluid className="my-3">
        {children}
      </Container>
    </Form>
  )
}

export default BasicForm
