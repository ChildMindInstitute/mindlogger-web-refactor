import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"

type Props = {
  width?: string

  progress: number
  buffer?: number

  isDisabled?: boolean

  onProgressBarClick: (progress: number) => void
}

export const AudioPlayerProgressBar = ({
  progress,
  buffer,
  width = "150px",
  onProgressBarClick,
  isDisabled,
}: Props) => {
  const onClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()

    const x = event.clientX - rect.left
    const barWidth = event.currentTarget.clientWidth

    const porgressPicked = (x / barWidth) * 100

    return onProgressBarClick(porgressPicked)
  }

  return (
    <Box width={width}>
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
