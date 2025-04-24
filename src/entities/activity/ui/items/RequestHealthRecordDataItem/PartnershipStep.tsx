import { Box, useTheme, useMediaQuery } from '@mui/material';

import requestHealthRecordDataPartnership from '~/assets/request-health-record-data-partnership.svg';
import { Markdown } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

export const PartnershipStep = () => {
  const { t } = useCustomTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      display="flex"
      flexDirection="column"
      fontWeight="400"
      fontSize="18px"
      lineHeight="28px"
      gap="24px"
      textAlign={isMobile ? 'left' : 'center'}
    >
      <Box display="flex" justifyContent="center" my="22px">
        <img
          src={requestHealthRecordDataPartnership}
          alt={String(t('requestHealthRecordData.title'))}
          style={{ maxWidth: '100%' }}
        />
      </Box>

      <Markdown
        markdown={t('requestHealthRecordData.partnershipText')}
        sx={{ '&& p': { mb: '24px' } }}
      />
    </Box>
  );
};
