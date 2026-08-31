import { lazy } from 'react';

const AuthorizedRoutes = lazy(() => import('./AuthorizedRoutes'));
const UnauthorizedRoutes = lazy(() => import('./UnauthorizedRoutes'));

// import { useDefaultBanners } from '~/entities/defaultBanners/model/hooks/useDefaultBanners';
import { userModel } from '~/entities/user';
import { SESSION_ENDED_KEY } from '~/shared/utils';
import { useSessionBanners } from '~/shared/utils/hooks/useSessionBanners';
import { useSessionAdoption } from '~/widgets/SessionKeepAlive';

function ApplicationRouter(): JSX.Element | null {
  // Mounted out here rather than in ProtectedRoute, which only renders once a session exists. This
  // is the one place a signed-out tab keeps running.
  useSessionAdoption();

  const { isAuthorized, tokens } = userModel.hooks.useAuthorization();

  // A tab whose session ended while it slept still reads that session's tokens and user from
  // storage. The marker is what tells this boot to ignore them and show the login page instead.
  const hasSessionEnded = !!sessionStorage.getItem(SESSION_ENDED_KEY);

  // useDefaultBanners();
  useSessionBanners();

  if (isAuthorized && !hasSessionEnded) {
    return <AuthorizedRoutes refreshToken={tokens.refreshToken} />;
  }

  return <UnauthorizedRoutes />;
}

export default ApplicationRouter;
