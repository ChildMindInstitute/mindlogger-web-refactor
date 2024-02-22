import Radio from "@mui/material/Radio"

import { BaseRadioActiveIcon } from "./BaseRadioActiveIcon"
import { BaseRadioIcon } from "./BaseRadioIcon"

type RadioItemOptionProps = {
  id: string
  name: string
  value: string | number

  disabled?: boolean
  defaultChecked?: boolean
}

export const RadioOption = (props: RadioItemOptionProps) => {
  const { id, name, value, disabled, defaultChecked } = props

  return (
    <Radio
      id={id}
      name={name}
      value={value}
      disabled={disabled}
      checked={defaultChecked}
      disableRipple
      color="default"
      checkedIcon={<BaseRadioActiveIcon />}
      icon={<BaseRadioIcon />}
    />
  )
}
