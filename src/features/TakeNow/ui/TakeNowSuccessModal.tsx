import { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { MuiModal } from '~/shared/ui';
import { useCustomTranslation, useOnceEffect } from '~/shared/utils';

export const TakeNowSuccessModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useCustomTranslation();

  const [isOpen, setIsOpen] = useState(false);

  useOnceEffect(() => {
    if (location.state && location.state.showTakeNowSuccessModal && !isOpen) {
      navigate(window.location.pathname, {
        state: {
          ...location.state,
          showTakeNowSuccessModal: undefined,
        } as unknown,
        replace: true,
      });

      setIsOpen(true);
    }
  });

  return (
    <MuiModal
      isOpen={isOpen}
      title={t('takeNow.successModalTitle')}
      label={t('takeNow.successModalLabel')}
      footerPrimaryButton={t('takeNow.successModalPrimaryAction')}
      onPrimaryButtonClick={() => {
        window.close();
        setIsOpen(false);
      }}
      footerSecondaryButton={t('takeNow.successModalSecondaryAction')}
      onSecondaryButtonClick={() => setIsOpen(false)}
      DialogProps={{
        disableEscapeKeyDown: true,
      }}
    />
  );
};
