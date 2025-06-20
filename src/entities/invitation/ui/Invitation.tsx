import { InvitationDetails, useInvitationTranslation } from '../lib';
import { InvitationContent } from './InvitationContent';
import { InvitationHeader } from './InvitationHeader';

import { variables } from '~/shared/constants/theme/variables';
import { Box, PageMessage } from '~/shared/ui';
import Logo from '~/shared/ui/Logo';

interface InvitationProps {
  actionComponent: JSX.Element;
  invite?: InvitationDetails;
  isUserAuthenticated: boolean;
}

export const Invitation = ({ invite, actionComponent, isUserAuthenticated }: InvitationProps) => {
  const { t } = useInvitationTranslation();

  if (invite?.status === 'approved') {
    return <PageMessage message={t('invitationAlreadyAccepted')} />;
  }

  if (invite?.status === 'declined') {
    return <PageMessage message={t('invitationAlreadyDeclined')} />;
  }

  return (
    <Box
      color={variables.palette.onPrimaryContainer}
      textAlign="left"
      data-testid="invitation-block"
    >
      {invite && (
        <>
          <InvitationHeader appletName={invite.appletName} role={invite.role} />
          {actionComponent}
          <InvitationContent
            appletName={invite.appletName}
            isUserAuthenticated={isUserAuthenticated}
          />

          <Box margin="12px 0px" data-testid="invitation-footer">
            <Box>
              <Logo size={{ width: 200, height: 80 }} />
            </Box>
            <small>{t('inviteContent.footer')}</small>
          </Box>
        </>
      )}
    </Box>
  );
};
