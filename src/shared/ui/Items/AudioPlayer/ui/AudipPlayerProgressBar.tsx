import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"

import { useCustomMediaQuery } from "~/shared/utils"

type Props = {
  width?: string

  progress: number
  buffer?: number

  isDisabled?: boolean

  onProgressBarClick: (progress: number) => void
}

export const AudioPlayerProgressBar = ({ progress, buffer, onProgressBarClick, isDisabled }: Props) => {
  const { lessThanSM } = useCustomMediaQuery()

  const onClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()

    const x = event.clientX - rect.left
    const barWidth = event.currentTarget.clientWidth

    const porgressPicked = (x / barWidth) * 100

    return onProgressBarClick(porgressPicked)
  }

  const defaultWidth = "150px"

  const width = lessThanSM ? "60px" : defaultWidth

  return (
    <Box sx={{ width }} data-testid="audio-player-progress">
      <LinearProgress
        variant="determinate"
        value={progress}
        valueBuffer={buffer}
        onClick={onClick}
        sx={{ cursor: isDisabled ? "default" : "pointer" }}
      />
    </Box>
  )
}
