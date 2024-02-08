import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';

type Props = {
  isMuted: boolean;

  value?: number;

  onHandleMute: () => void;
  onHandleUnmute: () => void;

  onChange: (volume: number) => void;

  mediaQuery?: {
    sm?: boolean;
  };
};

export const AudioPlayerVolume = ({
  isMuted,
  onHandleMute,
  onHandleUnmute,
  value = 50,
  onChange,
  mediaQuery,
}: Props) => {
  const onHandleChange = (event: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  const iconSize = mediaQuery?.sm ? 'small' : 'medium';

  const muteButtonTestId = isMuted ? 'audio-player-unmute-button' : 'audio-player-mute-button';

  return (
    <Box display="flex" alignItems="center" gap={mediaQuery?.sm ? 0.5 : 1}>
      <Box>
        <IconButton onClick={isMuted ? onHandleUnmute : onHandleMute} data-testid={muteButtonTestId}>
          {isMuted ? <VolumeOffIcon fontSize={iconSize} /> : <VolumeUpIcon fontSize={iconSize} />}
        </IconButton>
      </Box>

      <Box display="flex" data-testid="audio-player-volume-slider">
        <Slider
          size="small"
          value={value}
          onChange={onHandleChange}
          aria-label="Small"
          valueLabelDisplay="auto"
          sx={{ width: '50px' }}
        />
      </Box>
    </Box>
  );
};
