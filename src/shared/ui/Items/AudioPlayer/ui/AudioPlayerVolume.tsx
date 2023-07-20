import VolumeOffIcon from "@mui/icons-material/VolumeOff"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Slider from "@mui/material/Slider"

type Props = {
  isMuted: boolean

  value?: number

  onHandleMute: () => void
  onHandleUnmute: () => void

  onChange: (volume: number) => void
}

export const AudioPlayerVolume = ({ isMuted, onHandleMute, onHandleUnmute, value = 50, onChange }: Props) => {
  const onHandleChange = (event: Event, newValue: number | number[]) => {
    onChange(newValue as number)
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box>
        {isMuted ? (
          <IconButton onClick={onHandleUnmute}>
            <VolumeOffIcon />
          </IconButton>
        ) : (
          <IconButton onClick={onHandleMute}>
            <VolumeUpIcon />
          </IconButton>
        )}
      </Box>

      <Box display="flex">
        <Slider
          size="small"
          value={value}
          onChange={onHandleChange}
          aria-label="Small"
          valueLabelDisplay="auto"
          sx={{ width: "50px" }}
        />
      </Box>
    </Box>
  )
}
