import Box from "@mui/material/Box"

import { BaseProgressBar } from "~/shared/ui"

type Props = {
  percentage: number
}

export const ActivityCardProgressBar = ({ percentage }: Props) => {
  return (
    <Box sx={{ minWidth: "295px", maxWidth: "320px" }}>
      <BaseProgressBar percentage={percentage} hasInitialPercentage={false} height="4px" />
    </Box>
  )
}
