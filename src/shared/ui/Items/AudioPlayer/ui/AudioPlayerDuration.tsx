import { Typography } from "@mui/material"
import Box from "@mui/material/Box"

import { useCustomMediaQuery } from "~/shared/utils"

type Props = {
  currentDuration: string
  totalDuration: string
}

export const AudioPlayerDuration = ({ currentDuration, totalDuration }: Props) => {
  const { lessThanSM } = useCustomMediaQuery()

  const fontSize = lessThanSM ? "12px" : "14px"

  const width = lessThanSM ? "75px" : "100px"

  return (
    <Box width={width}>
      <Typography
        variant="body1"
        sx={{ cursor: "default", fontSize }}>{`${currentDuration} / ${totalDuration}`}</Typography>
    </Box>
  )
}
