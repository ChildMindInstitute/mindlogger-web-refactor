import Box from '@mui/material/Box';

import { useAuthorizationGuard } from '../../AuthorizationGuard';

import { Invitation, useInvitationTranslation, usePrivateInvitationQuery } from '~/entities/invitation';
import { PrivateJoinAcceptButton } from '~/features/PrivateJoinAccept';
import { PrivateJoinDeclineButton } from '~/features/PrivateJoinDecline';
import { PageMessage } from '~/shared/ui';
import Loader from '~/shared/ui/Loader';
import { useCustomMediaQuery } from '~/shared/utils';
import { AuthorizationButtons } from '~/widgets/AuthorizationNavigateButtons';

interface FetchPrivateInvitationProps {
  keyParams: string;
  redirectState?: Record<string, unknown>;
}

export const FetchPrivateInvitation = ({ keyParams, redirectState }: FetchPrivateInvitationProps) => {
  const { t } = useInvitationTranslation();
  const { isAuthenticated } = useAuthorizationGuard();
  const { lessThanSM } = useCustomMediaQuery();

  const { isError, data, isLoading } = usePrivateInvitationQuery(keyParams);

  if (isError) {
    return <PageMessage message={t('notFound')} />;
  }

  if (isLoading) {
    return (
      <Box display="flex" flex={1} justifyContent="center" alignItems="center" flexDirection="column">
        <Box>
          <div className="loading">{t('loadingInvitation')}</div>
          <Loader />
        </Box>
      </Box>
    );
  }

  return (
    <Invitation
      invite={data?.data?.result}
      isUserAuthenticated={isAuthenticated}
      actionComponent={
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row">
          {isAuthenticated ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap="12px"
              margin="16px 0px"
              flexDirection={lessThanSM ? 'column' : 'row'}
            >
              <PrivateJoinAcceptButton invitationKey={keyParams} />
              <PrivateJoinDeclineButton />
            </Box>
          ) : (
            <AuthorizationButtons redirectState={redirectState} />
          )}
        </Box>
      }
    />
  );
};
