import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomMediaQuery } from '~/shared/utils';

type Props = {
  currentDuration: string;
  totalDuration: string;
};

export const AudioPlayerDuration = ({ currentDuration, totalDuration }: Props) => {
  const { lessThanSM } = useCustomMediaQuery();

  const fontSize = lessThanSM ? '12px' : '14px';

  const width = lessThanSM ? '75px' : '100px';

  return (
    <Box width={width} data-testid="audio-player-duration">
      <Text
        variant="body1"
        fontSize={fontSize}
        sx={{ cursor: 'default' }}
      >{`${currentDuration} / ${totalDuration}`}</Text>
    </Box>
  );
};
