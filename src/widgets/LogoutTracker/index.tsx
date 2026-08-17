import { PropsWithChildren, useCallback, useEffect } from 'react';

import { useLogout } from '~/features/Logout';
import { eventEmitter } from '~/shared/utils';

type LogoutTrackerProps = PropsWithChildren<unknown>;

function LogoutTracker({ children }: LogoutTrackerProps) {
  const { logout } = useLogout();

  // Wrapped rather than passed straight through: the emitter calls its listeners with an event
  // payload, which would arrive as logout's options.
  const handleLogout = useCallback(() => logout(), [logout]);

  useEffect(() => {
    eventEmitter.on('onLogout', handleLogout);

    return () => {
      eventEmitter.off('onLogout', handleLogout);
    };
  }, [handleLogout]);

  return children as JSX.Element;
}

export default LogoutTracker;
