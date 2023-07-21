import PauseIcon from "@mui/icons-material/Pause"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import { IconButton, useMediaQuery, useTheme } from "@mui/material"
import Box from "@mui/material/Box"

type Props = {
  isPlaying: boolean
  isDisabled?: boolean

  onClick: () => void
}

export const AudioPlayerControls = ({ isPlaying, onClick, isDisabled }: Props) => {
  const theme = useTheme()
  const smMatch = useMediaQuery(theme.breakpoints.down("sm"))
  const iconSize = smMatch ? "small" : "medium"

  return (
    <Box>
      <IconButton onClick={onClick} disabled={isDisabled}>
        {isPlaying ? <PauseIcon fontSize={iconSize} /> : <PlayArrowIcon fontSize={iconSize} />}
      </IconButton>
    </Box>
  )
}
