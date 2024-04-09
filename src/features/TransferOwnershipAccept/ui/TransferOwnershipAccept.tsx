import Typography from '@mui/material/Typography';

import { useAcceptTransferOwnershipQuery } from '../api';

import { Box } from '~/shared/ui';
import { PageMessage } from '~/shared/ui';
import Loader from '~/shared/ui/Loader';
import { MixEvents, MixProperties, Mixpanel, useCustomTranslation } from '~/shared/utils';

type TransferOwnershipProps = {
  appletId: string;
  keyParam: string;
};

export const TransferOwnershipAccept = ({ appletId, keyParam }: TransferOwnershipProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'transferOwnership' });

  const adminPanelUrl = import.meta.env.VITE_ADMIN_PANEL_HOST ?? '';

  const { isLoading, isError } = useAcceptTransferOwnershipQuery(
    { appletId, key: keyParam },
    {
      onSuccess() {
        Mixpanel.track(MixEvents.TransferOwnershipAccepted, { [MixProperties.AppletId]: appletId });
      },
    },
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <PageMessage message={t('notFound')} />;
  }

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      data-testid="transfer-ownership-accepted"
    >
      <Typography
        variant="body1"
        fontSize="30px"
        margin="16px 0px"
        data-testid="transfer-ownership-accepted-title"
      >
        {t('accepted.title')}
      </Typography>
      <Box data-testid="transfer-ownership-accepted-content">
        <Typography variant="body2" fontSize="18px">
          {t('accepted.message1')}
        </Typography>
        <Typography
          variant="body2"
          fontSize="18px"
          sx={{ '& a:hover': { textDecoration: 'underline' } }}
        >
          {t('accepted.message2')}{' '}
          <a href={adminPanelUrl} target="_blank" rel="noreferrer">
            {t('adminPanel')}
          </a>
        </Typography>
      </Box>
    </Box>
  );
};
