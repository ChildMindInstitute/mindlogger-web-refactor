import { Form } from "react-bootstrap"

import { ValueLabel } from "../../../utils"

type SelectorItemProps = {
  value?: string
  valueLabelList: Array<ValueLabel>

  onValueChange: (value: string) => void
  disabled: boolean
}

export const SelectorItem = ({ value, onValueChange, valueLabelList, disabled }: SelectorItemProps) => {
  const defaultValue = "select"

  return (
    <Form.Control
      type="select"
      value={value}
      onChange={e => onValueChange(e.target.value)}
      required
      disabled={disabled}
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
