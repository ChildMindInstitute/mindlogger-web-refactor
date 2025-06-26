import { useBanners } from '~/entities/banner/model';
import { useAcceptInviteMutation, useInvitationTranslation } from '~/entities/invitation';
import ROUTES from '~/shared/constants/routes';
import { BaseButton, Box } from '~/shared/ui';
import { Mixpanel, MixpanelEventType, useCustomNavigation } from '~/shared/utils';

interface InvitationAcceptButtonProps {
  invitationKey: string;
}

export const InvitationAcceptButton = ({ invitationKey }: InvitationAcceptButtonProps) => {
  const { t } = useInvitationTranslation();
  const { navigate } = useCustomNavigation();

  const { addSuccessBanner } = useBanners();

  const { mutate: acceptInvite, isLoading: isAcceptLoading } = useAcceptInviteMutation({
    onSuccess() {
      addSuccessBanner(t('invitationAccepted'));
      Mixpanel.track({ action: MixpanelEventType.InvitationAccepted });
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
        color="success"
        onClick={onInviteAccept}
        isLoading={isAcceptLoading}
        text={t('buttons.acceptInvitation')}
      />
    </Box>
  );
};
