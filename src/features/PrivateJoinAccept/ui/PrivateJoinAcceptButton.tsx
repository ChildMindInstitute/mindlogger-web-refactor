import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

import { useAcceptPrivateInviteMutation, useInvitationTranslation } from '~/entities/invitation';
import { ROUTES } from '~/shared/constants';
import { BaseButton, useNotification } from '~/shared/ui';
import { MixEvents, MixProperties, Mixpanel } from '~/shared/utils';

interface PrivateJoinAcceptButtonProps {
  invitationKey: string;
  appletId: string;
}

export const PrivateJoinAcceptButton = ({
  invitationKey,
  appletId,
}: PrivateJoinAcceptButtonProps) => {
  const { t } = useInvitationTranslation();
  const navigate = useNavigate();
  const { showSuccessNotification } = useNotification();

  const { mutate: acceptPrivateInvite, isLoading } = useAcceptPrivateInviteMutation({
    onSuccess() {
      showSuccessNotification(t('invitationAccepted'));
      Mixpanel.track(MixEvents.InvitationAccepted, { [MixProperties.AppletId]: appletId });
      return navigate(ROUTES.appletList.path);
    },
  });

  const onPrivateJoinAccept = () => {
    return acceptPrivateInvite({ invitationId: invitationKey });
  };

  return (
    <Box width="250px">
      <BaseButton
        type="button"
        variant="contained"
        color="success"
        onClick={onPrivateJoinAccept}
        isLoading={isLoading}
        text={t('buttons.acceptInvitation')}
      />
    </Box>
  );
};
