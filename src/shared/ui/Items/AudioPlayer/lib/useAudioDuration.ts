import { RefObject, useState } from 'react';

import { formatDuration } from './formatDuration';

type Props = {
  audioRef: RefObject<HTMLAudioElement>;
};

type Return = {
  totalDuration: string;
  currentDuration: string;
  progress: number;

  updateCurrentDuration: () => void;
  setCurrentDuration: (progress: number) => void;
};

export const useAudioDuration = ({ audioRef }: Props): Return => {
  const [currentDurationSec, setCurrentDurationSec] = useState<number>(0);

  const totalDuration = audioRef.current?.duration ?? 0;

  const updateCurrentDuration = () => {
    return setCurrentDurationSec(audioRef.current?.currentTime ?? 0);
  };

  const setCurrentDuration = (progress: number) => {
    const durationToSet = (totalDuration * progress) / 100;

    if (audioRef.current?.currentTime) {
      audioRef.current.currentTime = durationToSet;
    }
  };

  const progress = totalDuration > 0 ? (currentDurationSec / totalDuration) * 100 : totalDuration;

  return {
    totalDuration: formatDuration(totalDuration),
    currentDuration: formatDuration(currentDurationSec),
    progress,
    updateCurrentDuration,
    setCurrentDuration,
  };
};
