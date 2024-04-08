import Box from '@mui/material/Box';
import { useParams, useSearchParams } from 'react-router-dom';

import { TransferOwnershipAccept } from '~/features/TransferOwnershipAccept';
import { TransferOwnershipDecline } from '~/features/TransferOwnershipDecline';
import { PageMessage } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';
import { AuthorizationGuard } from '~/widgets/AuthorizationGuard';

export default function TransferOwnershipPage() {
  const { appletId } = useParams();
  const [searchParams] = useSearchParams();

  const { t } = useCustomTranslation();

  const key = searchParams.get('key');
  const action = searchParams.get('action');

  if (!appletId || !key || !action) {
    return <PageMessage message={t('wrondLinkParametrError')} />;
  }

  return (
    <Box display="flex" flex={1} justifyContent="center" margin="24px 0px">
      <AuthorizationGuard>
        {action === 'accept' && <TransferOwnershipAccept appletId={appletId} keyParam={key} />}
        {action === 'decline' && <TransferOwnershipDecline appletId={appletId} keyParam={key} />}
      </AuthorizationGuard>
    </Box>
  );
}
