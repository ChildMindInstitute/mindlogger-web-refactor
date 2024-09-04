import { useCustomTranslation } from '~/shared/utils';

export const usePhrasalTemplateTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: 'PhrasalTemplate' });
  return { t, i18n };
};
