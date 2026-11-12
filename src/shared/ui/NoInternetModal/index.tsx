import { MuiModal } from '~/shared/ui/MuiModal';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
};

export const NoInternetModal = ({ isOpen, onDismiss }: Props) => {
  const { t } = useCustomTranslation({ keyPrefix: 'noInternet' });

  return (
    <MuiModal
      isOpen={isOpen}
      onHide={onDismiss}
      title={t('title')}
      label={t('description')}
      footerPrimaryButton={t('dismiss')}
      onPrimaryButtonClick={onDismiss}
      footerWrapperSXProps={{ marginLeft: 'auto' }}
      maxWidth="sm"
      testId="no-internet-modal"
    />
  );
};
