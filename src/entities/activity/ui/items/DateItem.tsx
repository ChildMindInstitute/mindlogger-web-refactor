import Box from "@mui/material/Box"

import { DateItemBase } from "~/shared/ui"

type Props = {
  value?: string

  onValueChange: (value: string[]) => void
}

export const DateItem = ({ value, onValueChange }: Props) => {
  const onHandleChange = (value: Date | null) => {
    if (value === null) {
      return
    }

    return onValueChange([value.toString()])
  }

  return (
    <Box display="flex" justifyContent="center" data-testid="date-item">
      <Box>
        <DateItemBase value={value ? new Date(value) : null} onChange={onHandleChange} />
      </Box>
    </Box>
  )
}
