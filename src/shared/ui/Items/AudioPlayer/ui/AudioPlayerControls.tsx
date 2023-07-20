import PauseIcon from "@mui/icons-material/Pause"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import { IconButton } from "@mui/material"
import Box from "@mui/material/Box"

type Props = {
  isPlaying: boolean
  onPlayClick: () => void
  onPauseClick: () => void

  isDisabled?: boolean

  mediaQuery?: {
    sm?: boolean
  }
}

export const AudioPlayerControls = ({ isPlaying, onPlayClick, onPauseClick, isDisabled, mediaQuery }: Props) => {
  const iconSize = mediaQuery?.sm ? "small" : "medium"

  return (
    <Box>
      <IconButton onClick={isPlaying ? onPauseClick : onPlayClick} disabled={isDisabled}>
        {isPlaying ? <PauseIcon fontSize={iconSize} /> : <PlayArrowIcon fontSize={iconSize} />}
      </IconButton>
    </Box>
  )
}
