import PauseIcon from "@mui/icons-material/Pause"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import { IconButton } from "@mui/material"
import Box from "@mui/material/Box"

type Props = {
  isPlaying: boolean
  onPlayClick: () => void
  onPauseClick: () => void

  isDisabled?: boolean
}

export const AudioPlayerControls = ({ isPlaying, onPlayClick, onPauseClick, isDisabled }: Props) => {
  return (
    <Box>
      <IconButton onClick={isPlaying ? onPauseClick : onPlayClick} disabled={isDisabled}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
    </Box>
  )
}
