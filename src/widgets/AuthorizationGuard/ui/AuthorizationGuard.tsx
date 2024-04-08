import { PropsWithChildren, ReactNode } from 'react';

import { useAuthorizationGuard } from '../lib';

import { LoginWithRedirect } from '~/widgets/LoginWithRedirect';

interface AuthorizationGuardProps extends PropsWithChildren {
  /**
   * A custom component to be rendered when the user is not authenticated. Defaults to `<LoginWithRedirect />`
   */
  fallback?: ReactNode;
}

/**
 * A component that prevents access to its children if the user is not authenticated. The default behavior is to
 * send the user to the login page, redirecting to the children afterwards. Provide a custom fallback component to override this behavior.
 */
export const AuthorizationGuard = ({
  fallback: optionalFallback,
  children,
}: AuthorizationGuardProps) => {
  const fallback = optionalFallback || <LoginWithRedirect />;

  const { isAuthenticated } = useAuthorizationGuard();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
