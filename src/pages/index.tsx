import { lazy } from 'react';

const UnauthorizedRoutes = lazy(() => import('./UnauthorizedRoutes'));
const AuthorizedRoutes = lazy(() => import('./AuthorizedRoutes'));

import { userModel } from '~/entities/user';

function ApplicationRouter(): JSX.Element | null {
  const { isAuthorized, tokens } = userModel.hooks.useAuthorization();

  if (isAuthorized) {
    return <AuthorizedRoutes refreshToken={tokens.refreshToken} />;
  }

  return <UnauthorizedRoutes />;
}

export default ApplicationRouter;
