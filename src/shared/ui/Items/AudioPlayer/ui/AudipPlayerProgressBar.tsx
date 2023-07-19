import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"

type Props = {
  width?: string

  progress: number
  buffer?: number
}

export const AudioPlayerProgressBar = ({ progress, buffer, width = "150px" }: Props) => {
  return (
    <Box width={width}>
      <LinearProgress variant="determinate" value={progress} valueBuffer={buffer} />
    </Box>
  )
}
