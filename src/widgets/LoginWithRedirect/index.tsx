import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '~/shared/constants';

interface LoginWithRedirectProps {
  /**
   * Where to go after the user logs in. Defaults to the current URL
   */
  redirectTo?: string;
}

/**
 * An empty component that automatically redirects to the login page if the user is not authenticated. Pass
 * the redirect state to specify where to go after the user logs in.
 */
export const LoginWithRedirect = ({ redirectTo }: LoginWithRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const backRedirectPath = redirectTo || `${location.pathname}${location.search}`;
    navigate(ROUTES.login.path, { state: { backRedirectPath } });
  }, [navigate, redirectTo]);

  return null;
};
