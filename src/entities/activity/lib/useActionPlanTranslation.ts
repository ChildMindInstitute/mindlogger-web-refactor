import { useCustomTranslation } from '~/shared/utils';

export const useActionPlanTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: 'ActionPlan' });
  return { t, i18n };
};
