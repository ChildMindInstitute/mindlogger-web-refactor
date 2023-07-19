import PauseIcon from "@mui/icons-material/Pause"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import { IconButton } from "@mui/material"
import Box from "@mui/material/Box"

type Props = {
  isPlaying: boolean
  onPlayClick: () => void
  onPauseClick: () => void
}

export const AudioPlayerControls = ({ isPlaying, onPlayClick, onPauseClick }: Props) => {
  return (
    <Box>
      {isPlaying ? (
        <IconButton onClick={onPauseClick}>
          <PauseIcon />
        </IconButton>
      ) : (
        <IconButton onClick={onPlayClick}>
          <PlayArrowIcon />
        </IconButton>
      )}
    </Box>
  )
}
