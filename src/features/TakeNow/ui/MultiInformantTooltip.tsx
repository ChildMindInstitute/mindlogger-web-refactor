import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

import TooltipIcon from '~/assets/tooltip-icon-i.svg';
import { useMultiInformantState } from '~/entities/applet/model/hooks';
import { MultiInformantTooltipText } from '~/features/TakeNow/ui/MultiInformantTooltipText';
import { variables } from '~/shared/constants/theme/variables';
import { useCustomTranslation } from '~/shared/utils';

export const MultiInformantTooltip = () => {
  const { t } = useCustomTranslation();
  const { getMultiInformantState, isInMultiInformantFlow } = useMultiInformantState();
  if (!isInMultiInformantFlow()) {
    return null;
  }

  const { sourceSubject, targetSubject, currentUserSubject } = getMultiInformantState();

  if (!sourceSubject || !targetSubject || !currentUserSubject) {
    return null;
  }

  return (
    <Tooltip
      title={
        <Box
          padding="4px 8px"
          maxWidth="none"
          borderRadius="4px"
          sx={{ backgroundColor: variables.palette.inverseSurface }}
        >
          <MultiInformantTooltipText
            caption={t('takeNow.tooltip.providingResponses')}
            subject={sourceSubject}
          />
          <MultiInformantTooltipText
            caption={t('takeNow.tooltip.inputtingResponses')}
            subject={currentUserSubject}
          />
          <MultiInformantTooltipText
            caption={t('takeNow.tooltip.subjectOfResponses')}
            subject={targetSubject}
          />
        </Box>
      }
      slotProps={{
        tooltip: {
          sx: {
            maxWidth: 'none',
            padding: 0,
          },
        },
      }}
    >
      <Avatar
        src={TooltipIcon}
        variant="square"
        sx={{ width: '20px', height: '20px', margin: '14px' }}
      />
    </Tooltip>
  );
};
