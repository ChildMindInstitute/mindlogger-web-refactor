import React from 'react';

import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

import TooltipIcon from '~/assets/tooltip-icon-i.svg';
import { useMultiInformantState } from '~/entities/applet/model/hooks';
import { MultiInformantTooltipText } from '~/features/TakeNow/ui/MultiInformantTooltipText';
import { Theme } from '~/shared/constants';
import { useCustomTranslation } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

export const MultiInformantTooltip = () => {
  const { t } = useCustomTranslation();
  const { getMultiInformantState, isInMultiInformantFlow } = useMultiInformantState();
  const { featureFlags } = useFeatureFlags();
  if (!isInMultiInformantFlow() || !featureFlags.enableMultiInformant) {
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
          sx={{ backgroundColor: Theme.colors.light.inverseSurface }}
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
