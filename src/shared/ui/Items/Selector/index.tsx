import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

import { ValueLabel } from "../../../utils"

type SelectorItemProps = {
  value: string
  valueLabelList: Array<ValueLabel>

  onValueChange: (value: string) => void
  disabled: boolean
}

export const SelectorItem = ({ value, onValueChange, valueLabelList, disabled }: SelectorItemProps) => {
  const defaultValue = "select"

  return (
    <FormControl size="medium" disabled={disabled} fullWidth>
      <InputLabel id="select-with-label">{defaultValue}</InputLabel>
      <Select
        id="select-with-label"
        labelId="select-with-label"
        value={value}
        label={defaultValue}
        onChange={e => onValueChange(e.target.value)}>
        {valueLabelList.map(item => {
          return (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
