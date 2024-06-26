import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Box } from '~/shared/ui';

type Props = {
  isPlaying: boolean;
  isDisabled?: boolean;

  onClick: () => void;
};

export const AudioPlayerControls = ({ isPlaying, onClick, isDisabled }: Props) => {
  const theme = useTheme();
  const smMatch = useMediaQuery(theme.breakpoints.down('sm'));
  const iconSize = smMatch ? 'small' : 'medium';

  const testid = isPlaying ? 'audio-player-pause-button' : 'audio-player-play-button';

  return (
    <Box>
      <IconButton onClick={onClick} disabled={isDisabled} data-testid={testid}>
        {isPlaying ? <PauseIcon fontSize={iconSize} /> : <PlayArrowIcon fontSize={iconSize} />}
      </IconButton>
    </Box>
  );
};
