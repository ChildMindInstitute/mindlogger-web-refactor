import Checkbox from "@mui/material/Checkbox"

import { BaseCheckboxActiveIcon } from "./BaseCheckboxActiveIcon"
import { BaseCheckboxIcon } from "./BaseCheckboxIcon"

type CheckboxItemOptionProps = {
  id: string
  name: string
  value: string | number

  disabled?: boolean
  defaultChecked?: boolean
}

export const CheckboxItem = (props: CheckboxItemOptionProps) => {
  const { id, name, value, disabled, defaultChecked } = props

  return (
    <Checkbox
      disableRipple
      id={id}
      name={name}
      value={value}
      disabled={disabled}
      checked={defaultChecked}
      color="default"
      checkedIcon={<BaseCheckboxActiveIcon />}
      icon={<BaseCheckboxIcon />}
    />
  )
}
