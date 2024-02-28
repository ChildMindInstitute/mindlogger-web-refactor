import { useCustomTranslation } from '~/shared/utils';

export const useForgotPasswordTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: 'ForgotPassword' });

  return { t, i18n };
};
