import { useNavigate } from 'react-router-dom';

import { useBanners } from '~/entities/banner/model';
import { useInvitationTranslation } from '~/entities/invitation';
import ROUTES from '~/shared/constants/routes';
import { Box } from '~/shared/ui';
import { BaseButton } from '~/shared/ui';

export const PrivateJoinDeclineButton = () => {
  const { t } = useInvitationTranslation();
  const navigate = useNavigate();
  const { addErrorBanner } = useBanners();

  const onInviteDecline = () => {
    addErrorBanner(t('invitationDeclined'));
    return navigate(ROUTES.appletList.path);
  };

  return (
    <Box width="250px">
      <BaseButton
        type="button"
        onClick={onInviteDecline}
        variant="contained"
        color="error"
        text={t('buttons.declineInvitation')}
      />
    </Box>
  );
};
