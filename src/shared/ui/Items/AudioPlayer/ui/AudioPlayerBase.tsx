import { useRef } from "react"

import { useMediaQuery, useTheme } from "@mui/material"
import Box from "@mui/material/Box"

import { useAudioControls, useAudioDuration, useAudioVolume } from "../lib"
import { AudioPlayerControls } from "./AudioPlayerControls"
import { AudioPlayerDuration } from "./AudioPlayerDuration"
import { AudioPlayerVolume } from "./AudioPlayerVolume"
import { AudioPlayerProgressBar } from "./AudipPlayerProgressBar"

type Props = {
  src: string
  playOnce?: boolean

  onHandlePlay?: () => void
  onHandlePause?: () => void
  onHandleEnded?: () => void
}

export const AudioPlayerItemBase = ({ src, playOnce }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const theme = useTheme()
  const smMatch = useMediaQuery(theme.breakpoints.down("sm"))

  const { isPlaying, play, pause } = useAudioControls({ audioRef })

  const { totalDuration, currentDuration, updateCurrentDuration, setCurrentDuration, progress } = useAudioDuration({
    audioRef,
  })

  const { isMuted, mute, unmute, volume, onVolumeChange } = useAudioVolume({ audioRef })

  const onHandlePause = () => {
    if (playOnce && isPlaying) {
      return
    }

    return pause()
  }

  const onHandleDurationChange = (progress: number) => {
    if (playOnce) {
      return
    }

    return setCurrentDuration(progress)
  }

  return (
    <Box>
      <audio ref={audioRef} src={src} loop={false} onTimeUpdate={updateCurrentDuration} />

      <Box
        display="flex"
        alignItems="center"
        gap={smMatch ? 0.5 : 1}
        sx={{ padding: smMatch ? "6px 12px" : "12px", borderRadius: "50px", backgroundColor: "#F0F3F4" }}>
        <AudioPlayerControls
          isPlaying={isPlaying}
          onPlayClick={play}
          onPauseClick={onHandlePause}
          isDisabled={playOnce && isPlaying}
          mediaQuery={{ sm: smMatch }}
        />
        <AudioPlayerDuration
          currentDuration={currentDuration}
          totalDuration={totalDuration}
          mediaQuery={{ sm: smMatch }}
        />
        <AudioPlayerProgressBar
          progress={progress}
          onProgressBarClick={onHandleDurationChange}
          isDisabled={playOnce && isPlaying}
          mediaQuery={{ sm: smMatch }}
        />
        <AudioPlayerVolume
          isMuted={isMuted}
          onHandleMute={mute}
          onHandleUnmute={unmute}
          value={volume}
          onChange={onVolumeChange}
        />
      </Box>
    </Box>
  )
}
