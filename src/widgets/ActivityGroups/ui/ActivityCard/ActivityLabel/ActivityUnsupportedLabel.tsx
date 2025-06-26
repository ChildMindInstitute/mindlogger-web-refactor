import Avatar from '@mui/material/Avatar';
import { isIOS } from 'react-device-detect';

import { APPSTORE_LINK, GOOGLEPLAY_LINK } from '~/abstract/lib/constants';
import ExclamationIcon from '~/assets/exclamation-circle.svg';
import { variables } from '~/shared/constants/theme/variables';
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
            backgroundColor: variables.palette.orangeAlpha30,
          }}
        >
          <Avatar src={ExclamationIcon} sx={{ width: '18px', height: '18px' }} />
          <Text color={variables.palette.onSurface} variant="bodyMedium">
            {t('mustBeCompletedUsingMobileApp')}
          </Text>
        </Box>

        <a href={storeLink} target="_blank" rel="noreferrer">
          <Text
            color={variables.palette.primary}
            variant="bodyMedium"
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
        backgroundColor: variables.palette.orangeAlpha30,
      }}
    >
      <Avatar src={ExclamationIcon} sx={{ width: '18px', height: '18px' }} />
      <Text color={variables.palette.onSurface} variant="bodyMedium">
        {t('pleaseCompleteOnThe')}
      </Text>
      <a href={storeLink} target="_blank" rel="noreferrer">
        <Text
          variant="bodyMedium"
          sx={{
            textDecoration: 'underline',
          }}
        >
          {`${t('curiousMobileApp')}.`}
        </Text>
      </a>
    </Box>
  );
};
