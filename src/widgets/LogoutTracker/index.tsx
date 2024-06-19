import { PropsWithChildren, useEffect } from 'react';

import { useLogout } from '~/features/Logout';
import { EventEmitter } from '~/shared/utils';

type LogoutTrackerProps = PropsWithChildren<unknown>;

function LogoutTracker({ children }: LogoutTrackerProps) {
  const { logout } = useLogout();

  useEffect(() => {
    EventEmitter.on('onLogout', logout);

    return () => {
      EventEmitter.off('onLogout', logout);
    };
  }, [logout]);

  return children as JSX.Element;
}

export default LogoutTracker;
