import AuthorizedRoutes from './AuthorizedRoutes';
import UnauthorizedRoutes from './UnauthorizedRoutes';

import { userModel } from '~/entities/user';
import { useSessionBanners } from '~/shared/utils/hooks/useSessionBanners';

function ApplicationRouter(): JSX.Element | null {
  const { isAuthorized, tokens } = userModel.hooks.useAuthorization();

  useSessionBanners();

  if (isAuthorized) {
    return <AuthorizedRoutes refreshToken={tokens.refreshToken} />;
  }

  return <UnauthorizedRoutes />;
}

export default ApplicationRouter;
