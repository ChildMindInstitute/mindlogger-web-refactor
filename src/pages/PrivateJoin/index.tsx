import { useLocation, useParams } from 'react-router-dom';

import { Box } from '~/shared/ui';
import { FetchPrivateInvitation } from '~/widgets/FetchInvitation';

export default function PrivateJoinPage() {
  const { joinLinkKey } = useParams();
  const location = useLocation();

  const redirectState = {
    isInvitationFlow: true,
    backRedirectPath: `${location.pathname}${location.search}`,
  };

  return (
    <Box display="flex" flex={1} margin="24px">
      {joinLinkKey && (
        <FetchPrivateInvitation keyParams={joinLinkKey} redirectState={redirectState} />
      )}
    </Box>
  );
}
