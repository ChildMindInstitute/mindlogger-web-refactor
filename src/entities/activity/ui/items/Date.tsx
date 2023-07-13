import Box from "@mui/material/Box"

import { DateItemBase } from "~/shared/ui"

type Props = {
  value?: string

  onValueChange: (value: string[]) => void

  width?: string
}

export const DateItem = ({ value, onValueChange, width }: Props) => {
  const onHandleChange = (value: string | null) => {
    if (value === null) {
      return
    }

    return onValueChange([value])
  }

  return (
    <Box display="flex" justifyContent="center">
      <Box sx={{ width }}>
        <DateItemBase value={value} onChange={onHandleChange} />
      </Box>
    </Box>
  )
}
