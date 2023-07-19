import { SyntheticEvent, useRef } from "react"

import Box from "@mui/material/Box"

import { useAudioPlayer } from "../lib"
import { AudioPlayerControls } from "./AudioPlayerControls"
import { AudioPlayerDuration } from "./AudioPlayerDuration"
import { AudioPlayerProgressBar } from "./AudipPlayerProgressBar"

type Props = {
  src: string
  playOnce?: boolean

  onHandlePlay?: (event: SyntheticEvent<HTMLAudioElement>) => void
  onHandlePause?: (event: SyntheticEvent<HTMLAudioElement>) => void
  onHandleEnded?: (event: SyntheticEvent<HTMLAudioElement>) => void
}

export const AudioPlayerItemBase = ({ src, playOnce }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const { isPlaying, currentDuration, totalDuration, play, pause, updateCurrentDuration } = useAudioPlayer({ audioRef })

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
        <AudioPlayerProgressBar progress={50} />
      </Box>
    </Box>
  )
}
