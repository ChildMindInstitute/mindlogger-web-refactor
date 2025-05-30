import { useRebrandBanner } from './useRebrandBanner';

import { dismissedBannersSelector } from '~/entities/defaultBanners/model/selectors';
import { userModel } from '~/entities/user';
import { useAppSelector } from '~/shared/utils';

export const useDefaultBanners = () => {
  const { isAuthorized, user } = userModel.hooks.useAuthorization();
  const userId = user?.id;

  const bannerScope = isAuthorized ? `user-${userId}` : 'global';

  const dismissed = useAppSelector(dismissedBannersSelector);

  useRebrandBanner(dismissed, bannerScope);
};
