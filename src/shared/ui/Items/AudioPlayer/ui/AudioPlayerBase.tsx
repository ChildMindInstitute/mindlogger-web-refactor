import { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';

import { AudioPlayerControls } from './AudioPlayerControls';
import { AudioPlayerDuration } from './AudioPlayerDuration';
import { AudioPlayerVolume } from './AudioPlayerVolume';
import { AudioPlayerProgressBar } from './AudipPlayerProgressBar';
import { useAudioControls, useAudioDuration, useAudioVolume } from '../lib';

import { useCustomMediaQuery } from '~/shared/utils';

type Props = {
  src: string;
  playOnce?: boolean;
  onFinish: () => void;

  onHandlePlay?: () => void;
  onHandlePause?: () => void;
  onHandleEnded?: () => void;
};

export const AudioPlayerItemBase = ({ src, playOnce, onFinish }: Props) => {
  const [hasFinishedAtLeastOnce, setHasFinishedAtLeastOnce] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const mediaQuery = useCustomMediaQuery();

  const { isPlaying, play, pause } = useAudioControls({ audioRef });

  const { totalDuration, currentDuration, updateCurrentDuration, setCurrentDuration, progress } =
    useAudioDuration({
      audioRef,
    });

  const { isMuted, mute, unmute, volume, volumeChange } = useAudioVolume({ audioRef });

  const onHandlePause = () => {
    if (playOnce && isPlaying) {
      return;
    }

    return pause();
  };

  const onHandleDurationChange = (progress: number) => {
    if (playOnce) {
      return;
    }

    return setCurrentDuration(progress);
  };

  useEffect(() => {
    if (progress === 100) {
      pause();
      setHasFinishedAtLeastOnce(true);
      onFinish();
    }
  }, [pause, progress, onFinish]);

  return (
    <Box data-testid="audio-player-wrap">
      <audio
        ref={audioRef}
        src={src}
        loop={false}
        onTimeUpdate={updateCurrentDuration}
        data-testid="audio-player-source"
      />

      <Box
        display="flex"
        alignItems="center"
        gap={mediaQuery.lessThanSM ? 0.5 : 1}
        sx={{
          padding: mediaQuery.lessThanSM ? '6px 12px' : '12px',
          borderRadius: '50px',
          backgroundColor: '#F0F3F4',
        }}
      >
        <AudioPlayerControls
          isPlaying={isPlaying}
          onClick={isPlaying ? onHandlePause : play}
          isDisabled={playOnce && isPlaying}
        />
        <AudioPlayerDuration currentDuration={currentDuration} totalDuration={totalDuration} />
        <AudioPlayerProgressBar
          progress={progress}
          onProgressBarClick={onHandleDurationChange}
          isDisabled={(playOnce && isPlaying) || !hasFinishedAtLeastOnce}
        />
        <AudioPlayerVolume
          isMuted={isMuted}
          onHandleMute={mute}
          onHandleUnmute={unmute}
          value={volume}
          onChange={volumeChange}
        />
      </Box>
    </Box>
  );
};
