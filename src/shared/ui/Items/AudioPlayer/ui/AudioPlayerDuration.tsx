import { Typography } from "@mui/material"
import Box from "@mui/material/Box"

import { MediaQueryReturn } from "~/shared/utils"

type Props = {
  currentDuration: string
  totalDuration: string

  mediaQuery?: MediaQueryReturn
}

export const AudioPlayerDuration = ({ currentDuration, totalDuration, mediaQuery }: Props) => {
  const fontSize = mediaQuery?.lessThanSM ? "12px" : "14px"

  const width = mediaQuery?.lessThanSM ? "75px" : "100px"

  return (
    <Box width={width}>
      <Typography
        variant="body1"
        sx={{ cursor: "default", fontSize }}>{`${currentDuration} / ${totalDuration}`}</Typography>
    </Box>
  )
}
