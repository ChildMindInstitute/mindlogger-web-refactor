import { Form } from "react-bootstrap"

type TextItemProps = {
  value: string | undefined
  setValue: (value: string) => void
  disabled: boolean
}

export const TextItem = ({ value, setValue, disabled }: TextItemProps) => {
  return <Form.Control type="text" value={value} onChange={event => setValue(event.target.value)} disabled={disabled} />
}
