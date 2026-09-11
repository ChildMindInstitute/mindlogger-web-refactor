import { useSessionKeepAlive } from './lib/useSessionKeepAlive';
import { SessionTimeoutModal } from './ui/SessionTimeoutModal';

// Sits inside the router, which useLogout depends on. Renders nothing until the session is close
// enough to its deadline to be worth warning about.
export const SessionKeepAlive = () => {
  const { msRemaining, stayLoggedIn, logOutNow } = useSessionKeepAlive();

  if (msRemaining === null) return null;

  return (
    <SessionTimeoutModal
      msRemaining={msRemaining}
      onStayLoggedIn={stayLoggedIn}
      onLogOut={logOutNow}
    />
  );
};
