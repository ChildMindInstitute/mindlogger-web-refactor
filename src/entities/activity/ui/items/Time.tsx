import Box from "@mui/material/Box"

import { TimeItemBase } from "~/shared/ui"

type Props = {
  value?: string
  label?: string

  onValueChange: (value: string[]) => void

  width?: string
}

export const TimeItem = ({ value, label, onValueChange, width }: Props) => {
  const onHandleChange = (value: Date | null) => {
    if (value === null) {
      return
    }

    return onValueChange([new Date(value).toString()])
  }

  return (
    <Box display="flex" justifyContent="center">
      <Box sx={{ width }}>
        <TimeItemBase value={value} label={label} onChange={onHandleChange} />
      </Box>
    </Box>
  )
}
