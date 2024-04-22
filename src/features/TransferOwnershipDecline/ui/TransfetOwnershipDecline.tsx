import { useDeclineTransferOwnershipQuery } from '../api';

import { PageMessage } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import Loader from '~/shared/ui/Loader';
import Text from '~/shared/ui/Text';
import { Mixpanel, useCustomTranslation } from '~/shared/utils';

type TransferOwnershipProps = {
  appletId: string;
  keyParam: string;
};

export const TransferOwnershipDecline = ({ appletId, keyParam }: TransferOwnershipProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'transferOwnership' });

  const { isLoading, isError } = useDeclineTransferOwnershipQuery(
    { appletId, key: keyParam },
    {
      onSuccess() {
        Mixpanel.track('Transfer Ownership Declined');
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
      data-testid="transfer-ownership-declined"
    >
      <Text
        variant="body1"
        fontSize="30px"
        margin="16px 0px"
        testid="transfer-ownership-declined-title"
      >
        {t('declined.title')}
      </Text>
      <Box data-testid="transfer-ownership-declined-content">
        <Text variant="body2" fontSize="18px">
          {t('declined.message1')}
        </Text>
        <Text variant="body2" fontSize="18px">
          {t('declined.message2')}
        </Text>
      </Box>
    </Box>
  );
};
