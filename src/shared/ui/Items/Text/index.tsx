import { Form } from "react-bootstrap"

type TextItemProps = {
  value: string | undefined
  onValueChange: (value: string) => void
  disabled: boolean
}

export const TextItem = ({ value, onValueChange, disabled }: TextItemProps) => {
  return (
    <Form.Control type="text" value={value} onChange={event => onValueChange(event.target.value)} disabled={disabled} />
  )
}
