import { Box } from '@mui/material';

import { MultiInformantSubject } from '~/abstract/lib/types/multiInformant';
import { Theme } from '~/shared/constants';
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
      <Text
        component="span"
        color={Theme.colors.light.inverseOnSurface}
        variant="subtitle2"
        fontWeight="700"
      >
        {caption}:
      </Text>
      <Text component="span" color={Theme.colors.light.inverseOnSurface} variant="body2">
        {text}
      </Text>
    </Box>
  );
};
