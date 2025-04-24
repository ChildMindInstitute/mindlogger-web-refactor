import { Box } from '@mui/material';

import requestHealthRecordDataPartnership from '~/assets/request-health-record-data-partnership.svg';
import { Markdown } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

export const PartnershipStep = () => {
  const { t } = useCustomTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      fontWeight="400"
      fontSize="18px"
      lineHeight="28px"
      mb="48px"
      gap="24px"
      textAlign="center"
    >
      <Box display="flex" justifyContent="center" my="22px">
        <img
          src={requestHealthRecordDataPartnership}
          alt={String(t('requestHealthRecordData.title'))}
        />
      </Box>

      <Markdown
        markdown={t('requestHealthRecordData.partnershipText')}
        sx={{ '&& p': { mb: '24px' } }}
      />
    </Box>
  );
};
