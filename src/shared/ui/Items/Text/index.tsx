import { Form } from "react-bootstrap"

type TextItemProps = {
  value: string | undefined
  setValue: (value: string) => void
}

export const TextItem = ({ value, setValue }: TextItemProps) => {
  return <Form.Control type="text" value={value} onChange={event => setValue(event.target.value)} />
}
