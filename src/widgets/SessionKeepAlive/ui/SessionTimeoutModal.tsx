import { SessionTimeoutModalProps } from './SessionTimeoutModal.types';

import { MuiModal } from '~/shared/ui';
import { formatCountdown, useCustomTranslation } from '~/shared/utils';

// Closing it any way at all keeps the session: dismissing without answering would leave the
// countdown running behind a modal the user can no longer see.
export const SessionTimeoutModal = ({
  msRemaining,
  onStayLoggedIn,
  onLogOut,
}: SessionTimeoutModalProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'sessionTimeout' });

  return (
    <MuiModal
      isOpen
      onHide={onStayLoggedIn}
      showCloseIcon
      title={t('title')}
      label={t('description', { countdown: formatCountdown(msRemaining) })}
      footerPrimaryButton={t('stayLoggedIn')}
      onPrimaryButtonClick={onStayLoggedIn}
      footerSecondaryButton={t('logOut')}
      onSecondaryButtonClick={onLogOut}
      // MuiModal centres its actions; the design puts them at the trailing edge.
      footerWrapperSXProps={{ marginLeft: 'auto' }}
      maxWidth="sm"
      testId="session-timeout-modal"
    />
  );
};
