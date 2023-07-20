import { useRef } from "react"

import Box from "@mui/material/Box"

import { useAudioPlayer } from "../lib"
import { AudioPlayerControls } from "./AudioPlayerControls"
import { AudioPlayerDuration } from "./AudioPlayerDuration"
import { AudioPlayerProgressBar } from "./AudipPlayerProgressBar"

type Props = {
  src: string
  playOnce?: boolean

  onHandlePlay?: () => void
  onHandlePause?: () => void
  onHandleEnded?: () => void
}

export const AudioPlayerItemBase = ({ src }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const {
    isPlaying,
    currentDuration,
    totalDuration,
    play,
    pause,
    updateCurrentDuration,
    setCurrentDuration,
    progress,
  } = useAudioPlayer({ audioRef })

  return (
    <Box sx={{}}>
      <audio ref={audioRef} src={src} loop={false} onTimeUpdate={updateCurrentDuration} />

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ padding: "12px", borderRadius: "50px", backgroundColor: "#F0F3F4" }}>
        <AudioPlayerControls isPlaying={isPlaying} onPlayClick={play} onPauseClick={pause} />
        <AudioPlayerDuration currentDuration={currentDuration} totalDuration={totalDuration} />
        <AudioPlayerProgressBar progress={progress} onProgressBarClick={setCurrentDuration} />
      </Box>
    </Box>
  )
}
