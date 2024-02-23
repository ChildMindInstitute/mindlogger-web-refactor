import { RefObject, useEffect, useState } from 'react';

type Props = {
  audioRef: RefObject<HTMLAudioElement>;
};

type Return = {
  isMuted: boolean;
  volume: number;

  mute: () => void;
  unmute: () => void;

  volumeChange: (volume: number) => void;
};

export const useAudioVolume = ({ audioRef }: Props): Return => {
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    if (audioRef.current?.volume === undefined) {
      return;
    }

    audioRef.current.volume = volume;
  }, [audioRef, volume]);

  const mute = () => {
    if (audioRef.current?.volume === undefined) {
      return;
    }

    setIsMuted(true);
    setVolume(audioRef.current.volume);
    audioRef.current.volume = 0;
  };

  const unmute = () => {
    if (audioRef.current?.volume === undefined) {
      return;
    }

    setIsMuted(false);
    audioRef.current.volume = volume;
  };

  const volumeChange = (volume: number) => {
    if (audioRef.current?.volume === undefined) {
      return;
    }

    if (volume === 0) {
      setIsMuted(true);
    }

    if (volume > 0) {
      setIsMuted(false);
    }

    setVolume(volume / 100);
  };

  return {
    isMuted,
    volume: isMuted ? 0 : Math.round(volume * 100),
    mute,
    unmute,
    volumeChange,
  };
};
