import { useCustomTranslation } from '~/shared/utils';

export const useInvitationTranslation = () => {
  return useCustomTranslation({ keyPrefix: 'invitation' });
};
