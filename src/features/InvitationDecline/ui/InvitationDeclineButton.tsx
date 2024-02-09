import Box from '@mui/material/Box';

import { useDeclineInviteMutation, useInvitationTranslation } from '~/entities/invitation';
import { ROUTES } from '~/shared/constants';
import { BaseButton, useNotification } from '~/shared/ui';
import { useCustomNavigation } from '~/shared/utils';

interface InvitationDeclineButtonProps {
  invitationKey: string;
}

export const InvitationDeclineButton = ({ invitationKey }: InvitationDeclineButtonProps) => {
  const { t } = useInvitationTranslation();
  const { navigate } = useCustomNavigation();

  const { showErrorNotification } = useNotification();

  const { mutate: declineInvite, isLoading: isDeclineLoading } = useDeclineInviteMutation({
    onSuccess() {
      showErrorNotification(t('invitationDeclined'));
      navigate(ROUTES.appletList.path);
    },
  });

  const onInviteDecline = () => {
    declineInvite({ invitationId: invitationKey });
  };

  return (
    <Box width="250px">
      <BaseButton
        type="button"
        variant="contained"
        color="error"
        onClick={onInviteDecline}
        isLoading={isDeclineLoading}
        text={t('buttons.declineInvitation')}
      ></BaseButton>
    </Box>
  );
};
