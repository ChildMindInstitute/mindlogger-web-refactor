import { RefObject, useState } from "react"

type Props = {
  audioRef: RefObject<HTMLAudioElement>
}

type Return = {
  isPlaying: boolean
  play: () => void
  pause: () => void
}

export const useAudioControls = ({ audioRef }: Props): Return => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const play = () => {
    audioRef.current?.play()
    return setIsPlaying(true)
  }

  const pause = () => {
    setIsPlaying(false)
    return audioRef.current?.pause()
  }

  return {
    isPlaying,
    play,
    pause,
  }
}
