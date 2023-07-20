import { Typography } from "@mui/material"
import Box from "@mui/material/Box"

type Props = {
  currentDuration: string
  totalDuration: string
}

export const AudioPlayerDuration = ({ currentDuration, totalDuration }: Props) => {
  return (
    <Box>
      <Typography variant="body1" sx={{ cursor: "default" }}>{`${currentDuration} / ${totalDuration}`}</Typography>
    </Box>
  )
}
