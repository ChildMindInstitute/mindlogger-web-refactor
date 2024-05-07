import Tooltip from '@mui/material/Tooltip';

import { MultiInformantSubject } from '~/abstract/lib/types/multiInformant';
import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';

type MultiInformantBadgeTileProps = {
  type: 'Subject' | 'Respondent';
  subject: MultiInformantSubject;
};

export const MultiInformantBadgeTile = ({ subject, type }: MultiInformantBadgeTileProps) => {
  const { id, secretId, nickname } = subject;
  const text = secretId ?? id;
  let tooltipText = `${type}: ${text}`;
  if (nickname) {
    tooltipText += `, ${nickname}`;
  }

  const backgroundColor = type === 'Subject' ? Theme.colors.light.inverseOnSurface : 'transparent';

  return (
    <Box
      display="flex"
      padding="8px"
      alignItems="center"
      gap="8px"
      flex="1 0 0"
      borderRadius="4px"
      width="78px"
      height="100%"
      sx={{ backgroundColor, cursor: 'default' }}
    >
      <Tooltip title={tooltipText}>
        <p
          style={{
            overflow: 'hidden',
            color: Theme.colors.light.onSurface,
            textOverflow: 'ellipsis',

            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </p>
      </Tooltip>
    </Box>
  );
};
