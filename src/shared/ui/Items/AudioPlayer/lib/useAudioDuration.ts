import { RefObject, useState } from "react"

import { formatDuration } from "./formatDuration"

type Props = {
  audioRef: RefObject<HTMLAudioElement>
}

type Return = {
  totalDuration: string
  currentDuration: string
  updateCurrentDuration: () => void
}

export const useAudioDuration = ({ audioRef }: Props): Return => {
  const [currentDurationSec, setCurrentDurationSec] = useState<number>(0)

  const totalDuration = formatDuration(audioRef.current?.duration ?? 0)
  const currentDuration = formatDuration(currentDurationSec)

  const updateCurrentDuration = () => {
    return setCurrentDurationSec(audioRef.current?.currentTime ?? 0)
  }

  return {
    totalDuration,
    currentDuration,
    updateCurrentDuration,
  }
}
