import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

import { TimeItemBase } from "~/shared/ui"

type Props = {
  values: string[]

  onValueChange: (value: string[]) => void
}

export const TimeRangeItem = ({ values, onValueChange }: Props) => {
  const theme = useTheme()
  const smMatch = useMediaQuery(theme.breakpoints.down("sm"))

  const onFromTimeHandleChange = (value: Date | null) => {
    if (!value) {
      return
    }

    const valuesBuffer = [...values]
    valuesBuffer[0] = new Date(value).toString()

    return onValueChange(valuesBuffer)
  }

  const onToTimeHandleChange = (value: Date | null) => {
    if (!value) {
      return
    }

    const valuesBuffer = [...values]
    valuesBuffer[1] = new Date(value).toString()

    return onValueChange(valuesBuffer)
  }

  return (
    <Box display="flex" justifyContent="center">
      <Box display="flex" alignItems="center" gap={smMatch ? 0.5 : 2}>
        <TimeItemBase value={values[0]} onChange={onFromTimeHandleChange} />
        <span>-</span>
        <TimeItemBase value={values[1]} onChange={onToTimeHandleChange} />
      </Box>
    </Box>
  )
}
