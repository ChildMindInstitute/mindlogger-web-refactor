import { useState } from 'react';

import { Theme } from '~/shared/constants';
import { Box, MuiModal } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

export const ConsentPublicModal = () => {
  const { t } = useCustomTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const onPublicClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();

    setIsOpen(true);
  };

  return (
    <>
      <Box component="span" onClick={onPublicClick} color={Theme.colors.light.primary}>
        {t('data_sharing.public')}
      </Box>
      <MuiModal
        isOpen={isOpen}
        onHide={() => setIsOpen(false)}
        label={t('data_sharing.dialog.body')}
        onPrimaryButtonClick={() => setIsOpen(false)}
        footerPrimaryButton="OK"
      />
    </>
  );
};
