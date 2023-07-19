import { RefObject } from "react"

import { useAudioControls } from "./useAudioControls"
import { useAudioDuration } from "./useAudioDuration"

type Props = {
  audioRef: RefObject<HTMLAudioElement>
}

type Return = {
  isPlaying: boolean
  src: string
  totalDuration: string
  currentDuration: string

  play: () => void
  pause: () => void
  updateCurrentDuration: () => void
}

export const useAudioPlayer = ({ audioRef }: Props): Return => {
  const { isPlaying, play, pause } = useAudioControls({ audioRef })

  const { totalDuration, currentDuration, updateCurrentDuration } = useAudioDuration({ audioRef })

  return {
    isPlaying,
    src: audioRef.current?.src ?? "",
    totalDuration,
    currentDuration,

    play,
    pause,
    updateCurrentDuration,
  }
}
