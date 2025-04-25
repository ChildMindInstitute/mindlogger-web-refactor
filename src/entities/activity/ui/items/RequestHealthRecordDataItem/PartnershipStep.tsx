import { Box } from '@mui/material';

import requestHealthRecordDataPartnership from '~/assets/request-health-record-data-partnership.svg';
import { ItemMarkdown } from '~/shared/ui';
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
      gap="24px"
    >
      <Box display="flex" justifyContent="center" my="22px">
        <img
          src={requestHealthRecordDataPartnership}
          alt={String(t('requestHealthRecordData.title'))}
          style={{ maxWidth: '100%' }}
        />
      </Box>

      <ItemMarkdown
        markdown={t('requestHealthRecordData.partnershipText')}
        sx={{ '&& > p': { mb: '24px' } }}
      />
    </Box>
  );
};
