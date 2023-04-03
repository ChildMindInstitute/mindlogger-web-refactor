import { Form } from "react-bootstrap"

type SelectorItemProps = {
  value?: string
  valueLabelList: Array<{ value: string | number; label: string | number }>

  onChangeValue: (value: string) => void
}

export const SelectorItem = ({ value, onChangeValue, valueLabelList }: SelectorItemProps) => {
  const defaultValue = "select"

  return (
    <Form.Control
      type="select"
      value={value}
      onChange={e => onChangeValue(e.target.value)}
      required
      defaultValue={defaultValue}>
      {valueLabelList.map(item => {
        return (
          <option value={item.value} key={item.value}>
            {item.label}
          </option>
        )
      })}
    </Form.Control>
  )
}
