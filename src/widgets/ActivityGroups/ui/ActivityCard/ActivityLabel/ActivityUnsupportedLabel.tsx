import Avatar from '@mui/material/Avatar';
import { isIOS } from 'react-device-detect';

import { APPSTORE_LINK, GOOGLEPLAY_LINK } from '~/abstract/lib/constants';
import ExclamationIcon from '~/assets/exclamation-circle.svg';
import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

export const ActivityUnsupportedLabel = () => {
  const { t } = useCustomTranslation();
  const { lessThanSM } = useCustomMediaQuery();

  const storeLink = isIOS ? APPSTORE_LINK : GOOGLEPLAY_LINK;

  if (lessThanSM) {
    return (
      <Box
        display="flex"
        gap="8px"
        flexDirection="column"
        textAlign="left"
        data-testid="unsupported-activity-label"
      >
        <Box
          display="flex"
          alignItems="center"
          gap="8px"
          sx={{
            padding: '4px 8px',
            borderRadius: '8px',
            backgroundColor: Theme.colors.light.accentOrange30,
          }}
        >
          <Avatar src={ExclamationIcon} sx={{ width: '18px', height: '18px' }} />
          <Text
            color={Theme.colors.light.onSurface}
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            letterSpacing="0.1px"
          >
            {t('mustBeCompletedUsingMobileApp')}
          </Text>
        </Box>

        <a href={storeLink} target="_blank" rel="noreferrer">
          <Text
            color={Theme.colors.light.primary}
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            letterSpacing="0.1px"
            sx={{
              textDecoration: 'underline',
            }}
          >
            {` ${t('completeUsingAppNow')}.`}
          </Text>
        </a>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="8px"
      data-testid="unsupported-activity-label"
      sx={{
        padding: '4px 8px',
        borderRadius: '8px',
        backgroundColor: Theme.colors.light.accentOrange30,
      }}
    >
      <Avatar src={ExclamationIcon} sx={{ width: '18px', height: '18px' }} />
      <Text
        color={Theme.colors.light.onSurface}
        fontSize="14px"
        fontWeight="400"
        lineHeight="20px"
        letterSpacing="0.1px"
      >
        {t('pleaseCompleteOnThe')}
      </Text>
      <a href={storeLink} target="_blank" rel="noreferrer">
        <Text
          color={Theme.colors.light.primary}
          fontSize="14px"
          fontWeight="400"
          lineHeight="20px"
          letterSpacing="0.1px"
          sx={{
            textDecoration: 'underline',
          }}
        >
          {` ${t('mindloggerMobileApp')}.`}
        </Text>
      </a>
    </Box>
  );
};
