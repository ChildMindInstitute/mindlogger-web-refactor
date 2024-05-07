import { useCustomTranslation } from '~/shared/utils';

export const useChangePasswordTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: 'ChangePassword' });

  return { t, i18n };
};
