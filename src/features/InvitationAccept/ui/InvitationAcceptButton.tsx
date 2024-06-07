import { useAcceptInviteMutation, useInvitationTranslation } from '~/entities/invitation';
import ROUTES from '~/shared/constants/routes';
import { Box } from '~/shared/ui';
import { BaseButton, useNotification } from '~/shared/ui';
import { Mixpanel, useCustomNavigation } from '~/shared/utils';

interface InvitationAcceptButtonProps {
  invitationKey: string;
}

export const InvitationAcceptButton = ({ invitationKey }: InvitationAcceptButtonProps) => {
  const { t } = useInvitationTranslation();
  const { navigate } = useCustomNavigation();

  const { showSuccessNotification } = useNotification();

  const { mutate: acceptInvite, isLoading: isAcceptLoading } = useAcceptInviteMutation({
    onSuccess() {
      showSuccessNotification(t('invitationAccepted'));
      Mixpanel.track('Invitation Accepted');
      return navigate(ROUTES.appletList.path);
    },
  });

  const onInviteAccept = () => {
    return acceptInvite({ invitationId: invitationKey });
  };

  return (
    <Box width="250px">
      <BaseButton
        type="button"
        variant="contained"
        color="success"
        onClick={onInviteAccept}
        isLoading={isAcceptLoading}
        text={t('buttons.acceptInvitation')}
      ></BaseButton>
    </Box>
  );
};
