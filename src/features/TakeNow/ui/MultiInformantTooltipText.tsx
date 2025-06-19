import { Box } from '@mui/material';

import { MultiInformantSubject } from '~/abstract/lib/types/multiInformant';
import { variables } from '~/shared/constants/theme/variables';
import { Text } from '~/shared/ui';

type MultiInformantBadgeTileProps = {
  caption: string;
  subject: MultiInformantSubject;
};

export const MultiInformantTooltipText = ({ subject, caption }: MultiInformantBadgeTileProps) => {
  const { id, secretId, nickname } = subject;
  let text = secretId ?? id;
  if (nickname) {
    text += `, ${nickname}`;
  }

  return (
    <Box display="flex" gap="8px" maxWidth="none">
      <Text color={variables.palette.inverseOnSurface} variant="labelLargeBold">
        {caption}:
      </Text>
      <Text color={variables.palette.inverseOnSurface} variant="labelLarge">
        {text}
      </Text>
    </Box>
  );
};
