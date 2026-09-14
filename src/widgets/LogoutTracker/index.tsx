import { PropsWithChildren, useCallback, useEffect } from 'react';

import { useLogout } from '~/features/Logout';
import { eventEmitter } from '~/shared/utils';

type LogoutTrackerProps = PropsWithChildren<unknown>;

function LogoutTracker({ children }: LogoutTrackerProps) {
  const { logout } = useLogout();

  // Only the token refresh failing gets here, which is a session ending on its own rather than the
  // user asking to leave. Saying so is what offers them back the page they were on.
  const handleLogout = useCallback(() => logout({ reason: 'refresh-failed' }), [logout]);

  useEffect(() => {
    eventEmitter.on('onLogout', handleLogout);

    return () => {
      eventEmitter.off('onLogout', handleLogout);
    };
  }, [handleLogout]);

  return children as JSX.Element;
}

export default LogoutTracker;
