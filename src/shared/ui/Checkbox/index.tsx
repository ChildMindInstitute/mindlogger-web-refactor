import { PropsWithChildren } from "react"

import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"

export interface CheckboxWithLabelProps extends PropsWithChildren {
  id?: string
  onChange: () => void
}

export const CheckboxWithLabel = ({ onChange, children, id }: CheckboxWithLabelProps) => {
  return (
    <FormGroup id={id}>
      <FormControlLabel control={<Checkbox onChange={onChange} />} label={children} />
    </FormGroup>
  )
}
