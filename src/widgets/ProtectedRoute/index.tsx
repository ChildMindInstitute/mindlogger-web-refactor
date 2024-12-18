import { Navigate, Outlet } from 'react-router-dom';

import ROUTES from '~/shared/constants/routes';
import { InactivityTracker } from '~/widgets/InactivityTracker/InactivityTracker';

export interface ProtectedRouteProps {
  redirectUrl?: string;
  token: string | undefined;
}

function ProtectedRoute({ redirectUrl = ROUTES.login.path, token }: ProtectedRouteProps) {
  if (!token) return <Navigate to={redirectUrl} replace />;

  return (
    <InactivityTracker>
      <Outlet />
    </InactivityTracker>
  );
}

export default ProtectedRoute;
