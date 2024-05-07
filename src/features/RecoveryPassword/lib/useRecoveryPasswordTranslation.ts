import { useCustomTranslation } from '~/shared/utils';

export const useRecoveryPasswordTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: 'ChangePassword' });

  return { t, i18n };
};
