import { RefObject, useState } from 'react';

type Props = {
  audioRef: RefObject<HTMLAudioElement>;
};

type Return = {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
};

export const useAudioControls = ({ audioRef }: Props): Return => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const play = async () => {
    if (!audioRef.current) {
      throw new Error('Audio ref is not defined');
    }
    await audioRef.current.play();
    return setIsPlaying(true);
  };

  const pause = () => {
    if (!audioRef.current) {
      throw new Error('Audio ref is not defined');
    }

    setIsPlaying(false);
    return audioRef.current.pause();
  };

  return {
    isPlaying,
    play,
    pause,
  };
};
