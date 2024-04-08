import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';

import { AuthorizationGuard } from '~/widgets/AuthorizationGuard';
import { FetchInvitation } from '~/widgets/FetchInvitation';

export default function InvitationPage() {
  const { inviteId } = useParams();

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center" margin="24px">
      {inviteId && (
        <AuthorizationGuard>
          <FetchInvitation keyParams={inviteId} />
        </AuthorizationGuard>
      )}
    </Box>
  );
}
