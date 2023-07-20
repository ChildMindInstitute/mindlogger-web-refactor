import { Typography } from "@mui/material"
import Box from "@mui/material/Box"

type Props = {
  currentDuration: string
  totalDuration: string

  mediaQuery?: {
    sm?: boolean
  }
}

export const AudioPlayerDuration = ({ currentDuration, totalDuration, mediaQuery }: Props) => {
  const fontSize = mediaQuery?.sm ? "12px" : "14px"

  const width = mediaQuery?.sm ? "75px" : "100px"

  return (
    <Box width={width}>
      <Typography
        variant="body1"
        sx={{ cursor: "default", fontSize }}>{`${currentDuration} / ${totalDuration}`}</Typography>
    </Box>
  )
}
