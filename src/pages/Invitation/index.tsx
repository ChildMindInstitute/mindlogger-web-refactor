import { useLocation, useParams } from 'react-router-dom';

import { Box } from '~/shared/ui';
import { AuthorizationGuard } from '~/widgets/AuthorizationGuard';
import { AuthorizationButtons } from '~/widgets/AuthorizationNavigateButtons';
import { FetchInvitation } from '~/widgets/FetchInvitation';

export default function InvitationPage() {
  const { inviteId } = useParams();
  const location = useLocation();

  const redirectState = {
    isInvitationFlow: true,
    backRedirectPath: `${location.pathname}${location.search}`,
  };

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center" margin="24px">
      {inviteId && (
        <AuthorizationGuard fallback={<AuthorizationButtons redirectState={redirectState} />}>
          <FetchInvitation keyParams={inviteId} />
        </AuthorizationGuard>
      )}
    </Box>
  );
}
