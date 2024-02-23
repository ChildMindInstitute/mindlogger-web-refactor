import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

import { useInvitationTranslation } from '~/entities/invitation';
import { ROUTES } from '~/shared/constants';
import { BaseButton, useNotification } from '~/shared/ui';

export const PrivateJoinDeclineButton = () => {
  const { t } = useInvitationTranslation();
  const navigate = useNavigate();
  const { showErrorNotification } = useNotification();

  const onInviteDecline = () => {
    showErrorNotification(t('invitationDeclined'));
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
