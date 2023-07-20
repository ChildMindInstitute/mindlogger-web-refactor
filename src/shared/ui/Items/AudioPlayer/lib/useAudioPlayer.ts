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
  progress: number

  play: () => void
  pause: () => void
  updateCurrentDuration: () => void
  setCurrentDuration: (progress: number) => void
}

export const useAudioPlayer = ({ audioRef }: Props): Return => {
  const { isPlaying, play, pause } = useAudioControls({ audioRef })

  const { totalDuration, currentDuration, updateCurrentDuration, setCurrentDuration, progress } = useAudioDuration({
    audioRef,
  })

  return {
    isPlaying,
    src: audioRef.current?.src ?? "",
    totalDuration,
    currentDuration,
    progress,

    play,
    pause,
    updateCurrentDuration,
    setCurrentDuration,
  }
}
