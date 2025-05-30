import { lazy } from 'react';

const AuthorizedRoutes = lazy(() => import('./AuthorizedRoutes'));
const UnauthorizedRoutes = lazy(() => import('./UnauthorizedRoutes'));

import { useDefaultBanners } from '~/entities/defaultBanners/model/hooks/useDefaultBanners';
import { userModel } from '~/entities/user';
import { useSessionBanners } from '~/shared/utils/hooks/useSessionBanners';

function ApplicationRouter(): JSX.Element | null {
  const { isAuthorized, tokens } = userModel.hooks.useAuthorization();

  useDefaultBanners();
  useSessionBanners();

  if (isAuthorized) {
    return <AuthorizedRoutes refreshToken={tokens.refreshToken} />;
  }

  return <UnauthorizedRoutes />;
}

export default ApplicationRouter;
