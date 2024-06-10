import { useBanners } from '~/entities/banner/model';
import { useDeclineInviteMutation, useInvitationTranslation } from '~/entities/invitation';
import ROUTES from '~/shared/constants/routes';
import { Box } from '~/shared/ui';
import { BaseButton } from '~/shared/ui';
import { useCustomNavigation } from '~/shared/utils';

interface InvitationDeclineButtonProps {
  invitationKey: string;
}

export const InvitationDeclineButton = ({ invitationKey }: InvitationDeclineButtonProps) => {
  const { t } = useInvitationTranslation();
  const { navigate } = useCustomNavigation();

  const { addErrorBanner } = useBanners();

  const { mutate: declineInvite, isLoading: isDeclineLoading } = useDeclineInviteMutation({
    onSuccess() {
      addErrorBanner(t('invitationDeclined'));
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
