import { useCallback } from 'react';

import Box from '@mui/material/Box';

import { AudioPlayerItem as AudioPlayerItemType } from '../../lib/types/item';

import { AudioPlayerItemBase } from '~/shared/ui';
import { AudioPlayerFinished } from '~/shared/ui/Items/AudioPlayer/lib';

type Props = {
  item: AudioPlayerItemType;

  value: string;
  onValueChange: (value: string[]) => void;
};

export const AudioPlayerItem = ({ item, onValueChange, value }: Props) => {
  const isAbleToPlayOnce = item.config.playOnce;

  const onFinish = useCallback(() => {
    if (!value) {
      onValueChange([AudioPlayerFinished]);
    }
  }, [value, onValueChange]);

  return (
    <Box display="flex" justifyContent="center" data-testid="audio-player-item">
      <AudioPlayerItemBase
        src={item.responseValues.file}
        playOnce={isAbleToPlayOnce}
        onFinish={onFinish}
      />
    </Box>
  );
};
