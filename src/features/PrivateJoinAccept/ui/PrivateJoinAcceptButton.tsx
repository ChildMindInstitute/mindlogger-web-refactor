import { useNavigate } from 'react-router-dom';

import { useBanners } from '~/entities/banner/model';
import { useAcceptPrivateInviteMutation, useInvitationTranslation } from '~/entities/invitation';
import ROUTES from '~/shared/constants/routes';
import { Box } from '~/shared/ui';
import { BaseButton } from '~/shared/ui';
import { MixpanelEvents, MixpanelProps, Mixpanel } from '~/shared/utils';

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
  const { addSuccessBanner } = useBanners();

  const { mutate: acceptPrivateInvite, isLoading } = useAcceptPrivateInviteMutation({
    onSuccess() {
      addSuccessBanner(t('invitationAccepted'));
      Mixpanel.track(MixpanelEvents.InvitationAccepted, {
        [MixpanelProps.AppletId]: appletId,
      });
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
