import { useInvitationTranslation } from '../lib';

import { Box } from '~/shared/ui';
import { Text } from '~/shared/ui';

interface InvitationHeaderProps {
  appletName: string;
  role: string;
}

export const InvitationHeader = ({ appletName, role }: InvitationHeaderProps) => {
  const { t } = useInvitationTranslation();

  return (
    <Box data-testid="invitation-header">
      <Text variant="h4" margin="12px 0px">
        {t('inviteContent.welcome')}
        <strong>{` ${appletName}`}</strong>
      </Text>
      <Text variant="body1">{`${t('inviteContent.title', { role })} ${appletName}. ${t(
        'inviteContent.toAccept',
      )}`}</Text>
    </Box>
  );
};
